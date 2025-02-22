import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import { cookies } from 'next/headers';

// Twitter OAuth 1.0a endpoints
const TWITTER_REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
const TWITTER_AUTH_URL = 'https://api.twitter.com/oauth/authorize';
const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/admin/twitter/callback`;

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

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET) {
      console.error('Twitter credentials are not configured');
      return NextResponse.json(
        { error: 'Twitter credentials are not configured' },
        { status: 500 }
      );
    }

    // Get request token
    const requestTokenResponse = await fetch(TWITTER_REQUEST_TOKEN_URL, {
      method: 'POST',
      headers: {
        ...oauth.toHeader(oauth.authorize({
          url: TWITTER_REQUEST_TOKEN_URL,
          method: 'POST',
          data: {
            oauth_callback: REDIRECT_URI
          }
        })),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        oauth_callback: REDIRECT_URI
      }).toString()
    });

    if (!requestTokenResponse.ok) {
      const error = await requestTokenResponse.text();
      console.error('Twitter request token error:', error);
      throw new Error('Failed to get Twitter request token');
    }

    const requestTokenData = new URLSearchParams(await requestTokenResponse.text());
    const oauthToken = requestTokenData.get('oauth_token');
    const oauthTokenSecret = requestTokenData.get('oauth_token_secret');

    if (!oauthToken || !oauthTokenSecret) {
      throw new Error('Failed to get OAuth tokens from Twitter');
    }

    // Store token secret in a cookie
    const cookieStore = cookies();
    cookieStore.set('twitter_oauth_token_secret', oauthTokenSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 5 // 5 minutes
    });

    // Build the authorization URL
    const authUrl = new URL(TWITTER_AUTH_URL);
    authUrl.searchParams.append('oauth_token', oauthToken);

    // Log debug info
    console.log('Twitter Auth URL:', authUrl.toString());
    console.log('Debug info:', {
      redirectUri: REDIRECT_URI,
      oauthToken
    });

    return NextResponse.json({ 
      authUrl: authUrl.toString(),
      redirectUri: REDIRECT_URI,
    });
  } catch (error) {
    console.error('Error generating Twitter auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    );
  }
} 