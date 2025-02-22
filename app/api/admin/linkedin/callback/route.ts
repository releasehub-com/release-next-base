import { NextResponse } from 'next/server';
import { upsertSocialAccount, db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const LINKEDIN_USERINFO_URL = 'https://api.linkedin.com/v2/userinfo';
const LINKEDIN_ME_URL = 'https://api.linkedin.com/v2/me';
const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/admin/linkedin/callback`;

async function getLinkedInTokens(code: string): Promise<any> {
  const response = await fetch(LINKEDIN_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
      redirect_uri: REDIRECT_URI,
    }).toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('LinkedIn token error:', error);
    throw new Error('Failed to get LinkedIn access token');
  }

  return response.json();
}

async function getLinkedInProfile(accessToken: string): Promise<any> {
  const userInfoResponse = await fetch(LINKEDIN_USERINFO_URL, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!userInfoResponse.ok) {
    const error = await userInfoResponse.text();
    console.error('LinkedIn profile error:', error);
    throw new Error('Failed to get LinkedIn profile');
  }

  const userInfo = await userInfoResponse.json();
  return {
    ...userInfo,
    memberId: userInfo.sub // Use the sub claim as the member ID
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error || errorDescription) {
    console.error('LinkedIn OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?error=linkedin_auth_failed&details=${encodeURIComponent(errorDescription || '')}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?error=missing_params`
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

    // Exchange code for tokens
    const tokenData = await getLinkedInTokens(code);
    console.log('LinkedIn token data:', tokenData);
    
    // Get user's profile using OIDC userinfo endpoint
    const profile = await getLinkedInProfile(tokenData.access_token);
    console.log('LinkedIn profile:', profile);

    // Store the connection in the database using the user's ID
    await upsertSocialAccount({
      id: `linkedin_${profile.sub}`,
      userId,
      provider: 'linkedin',
      providerAccountId: profile.memberId,
      accessToken: tokenData.access_token,
      tokenType: tokenData.token_type || undefined,
      scope: tokenData.scope || undefined,
      expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : undefined,
      metadata: {
        profile: {
          id: profile.sub,
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          memberId: profile.memberId
        }
      }
    });

    // Redirect back to the social accounts page
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?success=linkedin_connected`
    );
  } catch (error) {
    console.error('Error in LinkedIn callback:', error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?error=linkedin_connection_failed`
    );
  }
} 