import { NextResponse } from "next/server";
import { upsertSocialAccount, db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const LINKEDIN_USERINFO_URL = "https://api.linkedin.com/v2/userinfo";
const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/admin/linkedin/callback`;

interface LinkedInTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
}

interface LinkedInProfileResponse {
  sub: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  name?: string;
  locale?: {
    country: string;
    language: string;
  };
}

interface LinkedInProfile {
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
}

async function getLinkedInTokens(code: string): Promise<LinkedInTokenResponse> {
  const response = await fetch(LINKEDIN_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
      redirect_uri: REDIRECT_URI,
    }).toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("LinkedIn token error:", error);
    throw new Error("Failed to get LinkedIn access token");
  }

  const tokenResponse = (await response.json()) as LinkedInTokenResponse;
  return tokenResponse;
}

async function getLinkedInProfile(
  accessToken: string,
): Promise<LinkedInProfile> {
  try {
    // Get user info from OIDC userinfo endpoint
    const userInfoResponse = await fetch(LINKEDIN_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userInfoResponse.ok) {
      const error = await userInfoResponse.text();
      console.error("LinkedIn userinfo error:", error);
      throw new Error(`Failed to get LinkedIn user info: ${error}`);
    }

    const profileResponse =
      (await userInfoResponse.json()) as LinkedInProfileResponse;
    console.log("LinkedIn userInfo:", profileResponse);

    if (!profileResponse.sub) {
      console.error("LinkedIn sub ID not found in response:", profileResponse);
      throw new Error("LinkedIn sub ID not found in response");
    }

    return {
      memberId: profileResponse.sub,
      firstName: profileResponse.given_name || "",
      lastName: profileResponse.family_name || "",
      email: profileResponse.email || "",
    };
  } catch (error) {
    console.error(
      "Error in getLinkedInProfile:",
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error || errorDescription) {
    console.error("LinkedIn OAuth error:", error, errorDescription);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?error=linkedin_auth_failed&details=${encodeURIComponent(errorDescription || "")}`,
    );
  }

  if (!code || !state) {
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

    // Exchange code for tokens
    const tokenData = await getLinkedInTokens(code);
    console.log("LinkedIn token data:", tokenData);

    // Get user's profile
    const profile = await getLinkedInProfile(tokenData.access_token);
    console.log("LinkedIn profile:", profile);

    // Store the connection in the database using the user's ID
    await upsertSocialAccount({
      id: `linkedin_${profile.memberId}`,
      userId,
      provider: "linkedin",
      providerAccountId: profile.memberId,
      accessToken: tokenData.access_token,
      tokenType: tokenData.token_type || undefined,
      scope: tokenData.scope || undefined,
      expiresAt: tokenData.expires_in
        ? new Date(Date.now() + tokenData.expires_in * 1000)
        : undefined,
      metadata: {
        profile: {
          id: profile.memberId,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email || session.user.email,
          memberId: profile.memberId,
        },
      },
    });

    // Redirect back to the social accounts page
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?success=linkedin_connected`,
    );
  } catch (error) {
    console.error(
      "Error in LinkedIn callback:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/admin/social?error=linkedin_connection_failed`,
    );
  }
}
