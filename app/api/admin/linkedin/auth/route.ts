import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";

// LinkedIn OAuth 2.0 endpoints
const LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization";
const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/admin/linkedin/callback`;

// Required scopes for LinkedIn OpenID Connect and posting
const SCOPES = "openid profile email w_member_social";

export async function GET() {
  try {
    const session = await getServerSession();
    console.log("Current session:", session);

    if (!session?.user?.email) {
      console.error("No authenticated user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.LINKEDIN_CLIENT_ID) {
      console.error("LinkedIn client ID is not configured");
      return NextResponse.json(
        { error: "LinkedIn client ID is not configured" },
        { status: 500 },
      );
    }

    if (!process.env.NEXTAUTH_URL) {
      console.error("NEXTAUTH_URL is not configured");
      return NextResponse.json(
        { error: "NEXTAUTH_URL is not configured" },
        { status: 500 },
      );
    }

    // Generate a unique state to prevent CSRF
    const state = uuidv4();

    // Build the authorization URL manually to ensure proper encoding
    const authUrl = new URL(LINKEDIN_AUTH_URL);

    // Add required parameters with proper encoding
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("client_id", process.env.LINKEDIN_CLIENT_ID);
    authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.append("state", state);
    authUrl.searchParams.append("scope", SCOPES);

    // Log the full URL and debug info
    console.log("LinkedIn Auth URL:", authUrl.toString());
    console.log("Debug info:", {
      clientId: process.env.LINKEDIN_CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: SCOPES,
      state,
      fullUrl: authUrl.toString(),
      nextAuthUrl: process.env.NEXTAUTH_URL,
    });

    return NextResponse.json({
      authUrl: authUrl.toString(),
      redirectUri: REDIRECT_URI,
    });
  } catch (error) {
    console.error(
      "Error in LinkedIn auth:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      { error: "Failed to generate LinkedIn auth URL" },
      { status: 500 },
    );
  }
}
