import { NextResponse } from 'next/server';
import { upsertSocialAccount, db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

const TWITTER_TOKEN_URL = 'https://api.twitter.com/2/oauth2/token';
const TWITTER_USER_URL = 'https://api.twitter.com/2/users/me';
const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/admin/twitter/callback`;

async function getTwitterTokens(code: string, codeVerifier: string): Promise<any> {
  const response = await fetch(TWITTER_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }).toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Twitter token error:', error);
    throw new Error('Failed to get Twitter access token');
  }

  return response.json();
}

async function getTwitterProfile(accessToken: string): Promise<any> {
  const response = await fetch(TWITTER_USER_URL, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Twitter profile error:', error);
    throw new Error('Failed to get Twitter profile');
  }

  return response.json();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Get stored values from cookies
  const cookieStore = cookies();
  const storedState = cookieStore.get('twitter_state')?.value;
  const codeVerifier = cookieStore.get('twitter_code_verifier')?.value;

  // Clean up cookies immediately
  cookieStore.delete('twitter_state');
  cookieStore.delete('twitter_code_verifier');

  console.log('Callback params:', { code, state, storedState, codeVerifier, error, errorDescription });

  if (error || errorDescription) {
    console.error('Twitter OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?error=twitter_auth_failed&details=${encodeURIComponent(errorDescription || '')}`
    );
  }

  if (!code || !state) {
    console.error('Missing code or state');
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?error=missing_params`
    );
  }

  if (!storedState || !codeVerifier) {
    console.error('Missing stored state or code verifier');
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?error=missing_auth_data`
    );
  }

  if (state !== storedState) {
    console.error('State mismatch:', { state, storedState });
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?error=invalid_state`
    );
  }

  try {
    // Get the current session to get the authenticated user's email
    const session = await getServerSession();
    if (!session?.user?.email) {
      console.error('No authenticated user found');
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/admin/social?error=unauthorized`
      );
    }

    // Get the user's ID from the database
    const userResult = await db
      .select()
      .from(user)
      .where(eq(user.email, session.user.email));

    if (!userResult.length) {
      console.error('User not found in database');
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/admin/social?error=user_not_found`
      );
    }

    const userId = userResult[0].id;

    // Exchange code for tokens using the code verifier
    console.log('Exchanging code for tokens with verifier:', codeVerifier);
    const tokenData = await getTwitterTokens(code, codeVerifier);
    console.log('Twitter token data:', tokenData);
    
    // Get user's profile
    const profile = await getTwitterProfile(tokenData.access_token);
    console.log('Twitter profile:', profile);

    // Store the connection in the database using the user's ID
    await upsertSocialAccount({
      id: `twitter_${profile.data.id}`,
      userId,
      provider: 'twitter',
      providerAccountId: profile.data.id,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      tokenType: tokenData.token_type,
      scope: tokenData.scope,
      expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : undefined,
      metadata: {
        profile: {
          id: profile.data.id,
          name: profile.data.name,
          username: profile.data.username,
        }
      }
    });

    // Redirect back to the social accounts page with success message
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?success=twitter_connected`
    );
  } catch (error) {
    console.error('Error in Twitter callback:', error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?error=twitter_connection_failed`
    );
  }
} 