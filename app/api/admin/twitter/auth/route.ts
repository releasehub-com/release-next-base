export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { cookies } from "next/headers";

// Twitter OAuth 2.0 endpoints
const TWITTER_AUTH_URL = "https://x.com/i/oauth2/authorize";
const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/admin/twitter/callback`;

// Required scopes for Twitter API v2
const SCOPES = [
  "tweet.read",
  "tweet.write",
  "users.read",
  "offline.access",
].join(" ");

// Generate a code verifier and challenge for PKCE
function generatePKCE() {
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url");

  return { verifier, challenge };
}

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.TWITTER_CLIENT_ID) {
      console.error("Twitter client ID is not configured");
      return NextResponse.json(
        { error: "Twitter client ID is not configured" },
        { status: 500 },
      );
    }

    // Generate PKCE values
    const { verifier, challenge } = generatePKCE();

    // Generate state for CSRF protection
    const state = uuidv4();

    // Store code verifier in a cookie
    const cookieStore = cookies();

    // Clear any existing Twitter cookies to prevent session reuse
    cookieStore.delete("twitter_oauth_token");
    cookieStore.delete("twitter_oauth_token_secret");
    cookieStore.delete("twitter_state_v1");
    cookieStore.delete("twitter_oauth_token_secret_v1");
    cookieStore.delete("twitter_code_verifier");

    // Set new code verifier
    cookieStore.set("twitter_code_verifier", verifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 5, // 5 minutes
    });

    // Build the authorization URL
    const authUrl = new URL(TWITTER_AUTH_URL);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("client_id", process.env.TWITTER_CLIENT_ID);
    authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.append("scope", SCOPES);
    authUrl.searchParams.append("state", state);
    authUrl.searchParams.append("code_challenge", challenge);
    authUrl.searchParams.append("code_challenge_method", "S256");

    // Force Twitter to show the account selection screen
    authUrl.searchParams.append("force_login", "true");

    // Add a timestamp to prevent caching
    authUrl.searchParams.append("_", Date.now().toString());

    // Log debug info
    console.log("Twitter Auth URL:", authUrl.toString());
    console.log("Debug info:", {
      redirectUri: REDIRECT_URI,
      state,
    });

    return NextResponse.json({
      authUrl: authUrl.toString(),
      redirectUri: REDIRECT_URI,
    });
  } catch (error) {
    console.error("Error generating Twitter auth URL:", error);
    return NextResponse.json(
      { error: "Failed to generate authorization URL" },
      { status: 500 },
    );
  }
}
