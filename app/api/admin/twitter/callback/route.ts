import { NextResponse } from "next/server";
import { upsertSocialAccount, db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { user, socialAccounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

// Twitter OAuth 2.0 endpoints
const TWITTER_TOKEN_URL = "https://api.twitter.com/2/oauth2/token";
const TWITTER_USERINFO_URL = "https://api.twitter.com/2/users/me";

interface TwitterTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
}

interface TwitterUserResponse {
  data: {
    id: string;
    name: string;
    username: string;
  };
}

// Define a type for Twitter metadata
interface TwitterMetadata {
  profile: {
    id: string;
    name: string;
    username: string;
  };
  oauth2?: {
    codeVerifier: string;
  };
  oauth1?: {
    accessToken: string;
    tokenSecret: string;
  };
  username?: string;
  [key: string]: unknown;
}

async function getTwitterTokens(
  code: string,
  codeVerifier: string,
): Promise<TwitterTokenResponse> {
  // Create Basic Auth header from client ID and secret
  const basicAuth = Buffer.from(
    `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`,
  ).toString("base64");

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/admin/twitter/callback`,
    code_verifier: codeVerifier,
  });

  const response = await fetch(TWITTER_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Twitter token error:", error);
    throw new Error("Failed to get Twitter access token");
  }

  const tokenResponse = (await response.json()) as TwitterTokenResponse;
  return tokenResponse;
}

async function getTwitterProfile(
  accessToken: string,
): Promise<TwitterUserResponse> {
  const response = await fetch(TWITTER_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Twitter profile error:", error);
    throw new Error("Failed to get Twitter profile");
  }

  const userData = (await response.json()) as TwitterUserResponse;
  return userData;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Get stored code verifier from cookie
  const cookieStore = cookies();
  const codeVerifier = cookieStore.get("twitter_code_verifier")?.value;

  // Clean up cookies
  cookieStore.delete("twitter_code_verifier");

  console.log("Callback params:", { code, state, codeVerifier, error });

  if (error) {
    console.error("Twitter OAuth error:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?error=twitter_auth_denied`,
    );
  }

  if (!code || !codeVerifier) {
    console.error("Missing OAuth parameters");
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?error=missing_params`,
    );
  }

  try {
    // Get the current session to get the authenticated user's email
    const session = await getServerSession();
    if (!session?.user?.email) {
      console.error("No authenticated user found");
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/admin/social?error=unauthorized`,
      );
    }

    // Get the user's ID from the database
    const userResult = await db
      .select()
      .from(user)
      .where(eq(user.email, session.user.email));

    if (!userResult.length) {
      console.error("User not found in database");
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/admin/social?error=user_not_found`,
      );
    }

    const userId = userResult[0].id;

    // Exchange authorization code for access token
    console.log("Exchanging tokens...");
    const tokenData = await getTwitterTokens(code, codeVerifier);
    console.log("Twitter token data:", tokenData);

    // Get user's profile
    const profile = await getTwitterProfile(tokenData.access_token);
    console.log("Twitter profile:", profile);

    // Prepare OAuth 2.0 metadata
    const oauth2Metadata = {
      profile: {
        id: profile.data.id,
        name: profile.data.name,
        username: profile.data.username,
      },
      oauth2: {
        codeVerifier,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        token_type: tokenData.token_type,
        scope: tokenData.scope,
      },
    };

    // Check if an account with this ID already exists
    const accountId = `twitter_${profile.data.id}`;
    const existingAccount = await db
      .select()
      .from(socialAccounts)
      .where(eq(socialAccounts.id, accountId))
      .limit(1);

    if (existingAccount.length > 0) {
      console.log("Existing account found, merging metadata");
      const existing = existingAccount[0];

      // Get existing metadata
      const existingMetadata = existing.metadata || {};

      // Create merged metadata, preserving OAuth 1.0a data if it exists
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mergedMetadata: Record<string, any> = {
        profile: {
          id: profile.data.id,
          name: profile.data.name,
          username: profile.data.username,
        },
        oauth2: {
          codeVerifier,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_in: tokenData.expires_in,
          token_type: tokenData.token_type,
          scope: tokenData.scope,
        },
      };

      // Preserve OAuth 1.0a data if it exists
      if (existingMetadata && typeof existingMetadata === "object") {
        if (existingMetadata.oauth1) {
          mergedMetadata.oauth1 = existingMetadata.oauth1;
        }
        if (existingMetadata.username) {
          mergedMetadata.username = existingMetadata.username;
        }
      }

      console.log("Merged metadata:", mergedMetadata);

      // Update the account with OAuth 2.0 credentials while preserving OAuth 1.0a data
      await upsertSocialAccount({
        id: accountId,
        userId,
        provider: "twitter",
        providerAccountId: profile.data.id,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: tokenData.expires_in
          ? new Date(Date.now() + tokenData.expires_in * 1000)
          : null,
        tokenType: tokenData.token_type,
        scope: tokenData.scope,
        metadata: mergedMetadata,
      });
    } else {
      // New account, just use OAuth 2.0 data
      console.log("Creating new account with OAuth 2.0 credentials");
      await upsertSocialAccount({
        id: accountId,
        userId,
        provider: "twitter",
        providerAccountId: profile.data.id,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: tokenData.expires_in
          ? new Date(Date.now() + tokenData.expires_in * 1000)
          : null,
        tokenType: tokenData.token_type,
        scope: tokenData.scope,
        metadata: oauth2Metadata,
      });
    }

    // Redirect back to the social accounts page
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?success=twitter_connected`,
    );
  } catch (error) {
    console.error("Error in Twitter callback:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?error=twitter_connection_failed`,
    );
  }
}
