import { NextResponse } from 'next/server';
import { upsertSocialAccount } from '@/lib/db';

const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const LINKEDIN_ME_URL = 'https://api.linkedin.com/v2/me';
const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/admin/linkedin/callback`;

async function getLinkedInAccessToken(code: string): Promise<any> {
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
  const response = await fetch(LINKEDIN_ME_URL, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-Restli-Protocol-Version': '2.0.0',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('LinkedIn profile error:', error);
    throw new Error('Failed to get LinkedIn profile');
  }

  return response.json();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const email = searchParams.get('email');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error || errorDescription) {
    console.error('LinkedIn OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?error=linkedin_auth_failed&details=${encodeURIComponent(errorDescription || '')}`
    );
  }

  if (!code || !state || !email) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?error=missing_params`
    );
  }

  try {
    // Exchange code for access token
    const tokenData = await getLinkedInAccessToken(code);
    console.log('LinkedIn token data:', tokenData);
    
    // Get user's LinkedIn profile
    const profile = await getLinkedInProfile(tokenData.access_token);
    console.log('LinkedIn profile:', profile);

    // Store the connection in the database using the upsert helper
    await upsertSocialAccount({
      userId: email,
      provider: 'linkedin',
      providerAccountId: profile.id,
      accessToken: tokenData.access_token,
      tokenType: tokenData.token_type,
      scope: process.env.LINKEDIN_OAUTH_SCOPES,
      expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : undefined,
      metadata: {
        profile: {
          id: profile.id,
          firstName: profile.localizedFirstName,
          lastName: profile.localizedLastName,
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