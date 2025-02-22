import { NextResponse } from 'next/server';
import { upsertSocialAccount, db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

// Twitter OAuth 1.0a endpoints
const TWITTER_ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';
const TWITTER_VERIFY_CREDENTIALS_URL = 'https://api.twitter.com/1.1/account/verify_credentials.json';

// Create OAuth 1.0a instance
const oauth = new OAuth({
  consumer: {
    key: process.env.TWITTER_API_KEY!,
    secret: process.env.TWITTER_API_SECRET!
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto
      .createHmac('sha1', key)
      .update(base_string)
      .digest('base64');
  },
});

async function getTwitterTokens(oauthToken: string, oauthVerifier: string, tokenSecret: string): Promise<any> {
  const authHeader = oauth.toHeader(oauth.authorize({
    url: TWITTER_ACCESS_TOKEN_URL,
    method: 'POST',
    data: {
      oauth_token: oauthToken,
      oauth_verifier: oauthVerifier
    }
  }, {
    key: oauthToken,
    secret: tokenSecret
  }));

  const response = await fetch(TWITTER_ACCESS_TOKEN_URL, {
    method: 'POST',
    headers: {
      ...Object.fromEntries(Object.entries(authHeader)),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      oauth_token: oauthToken,
      oauth_verifier: oauthVerifier
    }).toString()
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Twitter token error:', error);
    throw new Error('Failed to get Twitter access token');
  }

  const data = new URLSearchParams(await response.text());
  return {
    oauth_token: data.get('oauth_token'),
    oauth_token_secret: data.get('oauth_token_secret'),
    user_id: data.get('user_id'),
    screen_name: data.get('screen_name')
  };
}

async function getTwitterProfile(accessToken: string, tokenSecret: string): Promise<any> {
  const authHeader = oauth.toHeader(oauth.authorize({
    url: TWITTER_VERIFY_CREDENTIALS_URL,
    method: 'GET'
  }, {
    key: accessToken,
    secret: tokenSecret
  }));

  const response = await fetch(TWITTER_VERIFY_CREDENTIALS_URL, {
    headers: Object.fromEntries(Object.entries(authHeader))
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
  const oauthToken = searchParams.get('oauth_token');
  const oauthVerifier = searchParams.get('oauth_verifier');
  const denied = searchParams.get('denied');

  // Get stored token secret from cookie
  const cookieStore = cookies();
  const tokenSecret = cookieStore.get('twitter_oauth_token_secret')?.value;

  // Clean up cookies
  cookieStore.delete('twitter_oauth_token_secret');

  console.log('Callback params:', { oauthToken, oauthVerifier, tokenSecret, denied });

  if (denied) {
    console.error('Twitter OAuth denied by user');
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?error=twitter_auth_denied`
    );
  }

  if (!oauthToken || !oauthVerifier || !tokenSecret) {
    console.error('Missing OAuth parameters');
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

    // Exchange request token for access token
    console.log('Exchanging tokens...');
    const tokenData = await getTwitterTokens(oauthToken, oauthVerifier, tokenSecret);
    console.log('Twitter token data:', tokenData);
    
    // Get user's profile
    const profile = await getTwitterProfile(tokenData.oauth_token, tokenData.oauth_token_secret);
    console.log('Twitter profile:', profile);

    // Store the connection in the database using the user's ID
    await upsertSocialAccount({
      id: `twitter_${tokenData.user_id}`,
      userId,
      provider: 'twitter',
      providerAccountId: tokenData.user_id,
      accessToken: tokenData.oauth_token,
      metadata: {
        tokenSecret: tokenData.oauth_token_secret,
        profile: {
          id: tokenData.user_id,
          name: profile.name,
          screenName: tokenData.screen_name
        }
      }
    });

    // Redirect back to the social accounts page
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