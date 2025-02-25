import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { user, socialAccounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import OAuth from "oauth-1.0a";
import crypto from "crypto";
import { upsertSocialAccount } from "@/lib/db";

const TWITTER_ACCESS_TOKEN_URL = "https://api.twitter.com/oauth/access_token";
const TWITTER_VERIFY_CREDENTIALS_URL =
  "https://api.twitter.com/1.1/account/verify_credentials.json";

interface TwitterV1TokenResponse {
  oauth_token: string;
  oauth_token_secret: string;
  user_id: string;
  screen_name: string;
}

interface TwitterV1UserResponse {
  id_str: string;
  name: string;
  screen_name: string;
  profile_image_url_https?: string;
}

async function getTwitterAccessToken(
  oauthToken: string,
  oauthVerifier: string,
  oauthTokenSecret: string,
): Promise<TwitterV1TokenResponse> {
  const oauth = new OAuth({
    consumer: {
      key: process.env.TWITTER_API_KEY!,
      secret: process.env.TWITTER_API_SECRET!,
    },
    signature_method: "HMAC-SHA1",
    hash_function(baseString: string, key: string) {
      return crypto.createHmac("sha1", key).update(baseString).digest("base64");
    },
  });

  const requestData = {
    url: TWITTER_ACCESS_TOKEN_URL,
    method: "POST",
    data: {
      oauth_token: oauthToken,
      oauth_verifier: oauthVerifier,
    },
  };

  const token = {
    key: oauthToken,
    secret: oauthTokenSecret,
  };

  const response = await fetch(requestData.url, {
    method: requestData.method,
    headers: {
      ...oauth.toHeader(oauth.authorize(requestData, token)),
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Twitter access token error:", error);
    throw new Error("Failed to get access token");
  }

  const responseText = await response.text();
  const urlParams = new URLSearchParams(responseText);

  return {
    oauth_token: urlParams.get("oauth_token"),
    oauth_token_secret: urlParams.get("oauth_token_secret"),
    user_id: urlParams.get("user_id"),
    screen_name: urlParams.get("screen_name"),
  };
}

async function getTwitterProfile(
  accessToken: string,
  tokenSecret: string,
): Promise<TwitterV1UserResponse> {
  const oauth = new OAuth({
    consumer: {
      key: process.env.TWITTER_API_KEY!,
      secret: process.env.TWITTER_API_SECRET!,
    },
    signature_method: "HMAC-SHA1",
    hash_function(baseString: string, key: string) {
      return crypto.createHmac("sha1", key).update(baseString).digest("base64");
    },
  });

  const requestData = {
    url: TWITTER_VERIFY_CREDENTIALS_URL,
    method: "GET",
  };

  const token = {
    key: accessToken,
    secret: tokenSecret,
  };

  const response = await fetch(requestData.url, {
    headers: {
      ...oauth.toHeader(oauth.authorize(requestData, token)),
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Twitter profile error:", error);
    throw new Error("Failed to get Twitter profile");
  }

  const tokenResponse = (await response.json()) as TwitterV1TokenResponse;
  const userResponse = await fetch(TWITTER_VERIFY_CREDENTIALS_URL, {
    headers: {
      ...oauth.toHeader(oauth.authorize(requestData, token)),
    },
  });

  if (!userResponse.ok) {
    const error = await userResponse.text();
    console.error("Twitter user profile error:", error);
    throw new Error("Failed to get Twitter user profile");
  }

  const userData = (await userResponse.json()) as TwitterV1UserResponse;

  return {
    id_str: userData.id_str,
    name: userData.name,
    screen_name: userData.screen_name,
    profile_image_url_https: userData.profile_image_url_https,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const oauthToken = searchParams.get("oauth_token");
  const oauthVerifier = searchParams.get("oauth_verifier");
  const state = searchParams.get("state");

  // Get stored token secret and state from cookies
  const cookieStore = cookies();
  const storedTokenSecret = cookieStore.get(
    "twitter_oauth_token_secret_v1",
  )?.value;
  const storedState = cookieStore.get("twitter_state_v1")?.value;

  // Clean up cookies
  cookieStore.delete("twitter_oauth_token_secret_v1");
  cookieStore.delete("twitter_state_v1");

  if (!oauthToken || !oauthVerifier || !storedTokenSecret) {
    console.error("Missing OAuth parameters");
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?error=missing_params`,
    );
  }

  if (state !== storedState) {
    console.error("State mismatch");
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?error=invalid_state`,
    );
  }

  try {
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

    // Exchange request token for access token
    console.log("Exchanging tokens...");
    const tokenData = await getTwitterAccessToken(
      oauthToken,
      oauthVerifier,
      storedTokenSecret,
    );
    console.log("Twitter token data:", tokenData);

    // Get user's profile
    const profile = await getTwitterProfile(
      tokenData.oauth_token,
      tokenData.oauth_token_secret,
    );
    console.log("Twitter profile:", profile);

    // Check if an account with this ID already exists
    const accountId = `twitter_${profile.id_str}`;
    const existingAccount = await db
      .select()
      .from(socialAccounts)
      .where(eq(socialAccounts.id, accountId))
      .limit(1);

    // Prepare the OAuth 1.0a metadata
    const oauth1Metadata = {
      username: profile.screen_name,
      profile: {
        id: profile.id_str,
        name: profile.name,
        username: profile.screen_name,
      },
      oauth1: {
        accessToken: tokenData.oauth_token,
        tokenSecret: tokenData.oauth_token_secret,
      },
    };

    // If account exists, merge metadata to preserve OAuth 2.0 credentials
    if (existingAccount.length > 0) {
      console.log("Existing account found, merging metadata");
      const existing = existingAccount[0];

      // Get existing metadata
      const existingMetadata = existing.metadata || {};

      // Create merged metadata, preserving OAuth 2.0 data if it exists
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mergedMetadata: Record<string, any> = {
        username: profile.screen_name,
        profile: {
          id: profile.id_str,
          name: profile.name,
          username: profile.screen_name,
        },
        oauth1: {
          accessToken: tokenData.oauth_token,
          tokenSecret: tokenData.oauth_token_secret,
        },
      };

      // Preserve OAuth 2.0 data if it exists
      if (existingMetadata && typeof existingMetadata === "object") {
        if (existingMetadata.oauth2) {
          mergedMetadata.oauth2 = existingMetadata.oauth2;
        }
      }

      console.log("Merged metadata:", mergedMetadata);

      // Use existing tokenType and scope if they exist (to preserve OAuth 2.0 scopes)
      await upsertSocialAccount({
        id: accountId,
        userId,
        provider: "twitter",
        providerAccountId: profile.id_str,
        accessToken: tokenData.oauth_token,
        refreshToken: existing.refreshToken,
        expiresAt: existing.expiresAt,
        tokenType: existing.tokenType || "oauth1", // Preserve OAuth 2.0 token type if it exists
        scope: existing.scope || "", // Preserve OAuth 2.0 scopes if they exist
        metadata: mergedMetadata,
      });
    } else {
      // New account, just use OAuth 1.0a data
      console.log("Creating new account with OAuth 1.0a credentials");
      await upsertSocialAccount({
        id: accountId,
        userId,
        provider: "twitter",
        providerAccountId: profile.id_str,
        accessToken: tokenData.oauth_token,
        refreshToken: null,
        expiresAt: null,
        tokenType: "oauth1",
        scope: "",
        metadata: oauth1Metadata,
      });
    }

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?success=twitter_v1_connected`,
    );
  } catch (error) {
    console.error("Error in Twitter callback:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?error=twitter_v1_connection_failed`,
    );
  }
}
