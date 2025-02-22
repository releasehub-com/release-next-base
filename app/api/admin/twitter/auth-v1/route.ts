import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
import OAuth from "oauth-1.0a";
import crypto from "crypto";

// Twitter OAuth 1.0a endpoints
const TWITTER_REQUEST_TOKEN_URL = "https://api.twitter.com/oauth/request_token";
const TWITTER_AUTH_URL = "https://api.twitter.com/oauth/authorize";
const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/admin/twitter/callback-v1`;

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET) {
      console.error("Twitter API credentials are not configured");
      return NextResponse.json(
        { error: "Twitter API credentials are not configured" },
        { status: 500 },
      );
    }

    // Create OAuth 1.0a instance
    const oauth = new OAuth({
      consumer: {
        key: process.env.TWITTER_API_KEY,
        secret: process.env.TWITTER_API_SECRET,
      },
      signature_method: "HMAC-SHA1",
      hash_function(baseString: string, key: string) {
        return crypto
          .createHmac("sha1", key)
          .update(baseString)
          .digest("base64");
      },
    });

    // Generate state for CSRF protection
    const state = uuidv4();

    // Request a token from Twitter
    const requestData = {
      url: TWITTER_REQUEST_TOKEN_URL,
      method: "POST",
      data: {
        oauth_callback: `${REDIRECT_URI}?state=${state}`,
      },
    };

    const response = await fetch(requestData.url, {
      method: requestData.method,
      headers: {
        ...oauth.toHeader(oauth.authorize(requestData)),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Twitter request token error:", error);
      throw new Error("Failed to get request token");
    }

    const responseText = await response.text();
    const urlParams = new URLSearchParams(responseText);
    const oauthToken = urlParams.get("oauth_token");
    const oauthTokenSecret = urlParams.get("oauth_token_secret");

    if (!oauthToken || !oauthTokenSecret) {
      throw new Error("Failed to get OAuth token or token secret");
    }

    // Store token secret and state in cookies
    const cookieStore = cookies();
    cookieStore.set("twitter_oauth_token_secret_v1", oauthTokenSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 5, // 5 minutes
    });
    cookieStore.set("twitter_state_v1", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 5, // 5 minutes
    });

    // Build the authorization URL
    const authUrl = new URL(TWITTER_AUTH_URL);
    authUrl.searchParams.append("oauth_token", oauthToken);

    // Log debug info
    console.log("Twitter OAuth 1.0a Auth URL:", authUrl.toString());
    console.log("Debug info:", {
      redirectUri: REDIRECT_URI,
      state,
    });

    return NextResponse.json({
      authUrl: authUrl.toString(),
      redirectUri: REDIRECT_URI,
    });
  } catch (error) {
    console.error("Error generating Twitter OAuth 1.0a auth URL:", error);
    return NextResponse.json(
      { error: "Failed to generate authorization URL" },
      { status: 500 },
    );
  }
}
