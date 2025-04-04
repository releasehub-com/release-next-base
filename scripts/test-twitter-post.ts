#!/usr/bin/env node

import { Command } from "commander";
import { db } from "../lib/db";
import { socialAccounts, user } from "../lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import OAuth from "oauth-1.0a";
import crypto from "crypto";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Verify required environment variables
if (!process.env.POSTGRES_URL) {
  console.error("❌ Error: POSTGRES_URL environment variable is not set");
  console.log("Please ensure .env.local is properly loaded");
  process.exit(1);
}

const program = new Command();

program
  .name("test-twitter-post")
  .description("Test Twitter API posting with OAuth 2.0 User Context")
  .option("-e, --email <email>", "User email to use for testing")
  .option(
    "-c, --content <content>",
    "Content to post",
    "Test post from Release - " + new Date().toISOString(),
  )
  .option("-v, --verbose", "Enable verbose logging", true)
  .option("--debug-auth", "Show full auth details for debugging", false);

program.parse();

const options = program.opts();

// Helper function for verbose logging
function verboseLog(...args: any[]) {
  if (options.verbose) {
    console.log(...args);
  }
}

// Define types for Twitter metadata
interface TwitterOAuth1Credentials {
  accessToken: string;
  tokenSecret: string;
}

interface TwitterOAuth2Credentials {
  access_token?: string;
  refresh_token?: string;
  codeVerifier?: string;
}

interface TwitterProfile {
  id: string;
  name: string;
  username: string;
}

interface TwitterMetadata {
  username?: string;
  profile?: TwitterProfile;
  oauth1?: TwitterOAuth1Credentials;
  oauth2?: TwitterOAuth2Credentials;
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
}

// Helper function to upload media to Twitter using OAuth 1.0a
async function uploadTwitterMedia(
  imageAsset: { asset: string; displayUrl: string },
  oauth: OAuth,
  oauth1Creds: { accessToken: string; tokenSecret: string },
): Promise<string> {
  const requestData = {
    url: "https://upload.twitter.com/1.1/media/upload.json",
    method: "POST",
    data: {
      media_id: imageAsset.asset,
    },
  };

  const token = {
    key: oauth1Creds.accessToken,
    secret: oauth1Creds.tokenSecret,
  };

  const response = await fetch(requestData.url, {
    method: requestData.method,
    headers: {
      ...oauth.toHeader(oauth.authorize(requestData, token)),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(requestData.data).toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to upload media: ${error}`);
  }

  const data = await response.json();
  return data.media_id_string;
}

interface TwitterRequestData {
  text: string;
  media?: {
    media_ids?: string[];
  };
}

async function postToTwitter(
  content: string,
  account: typeof socialAccounts.$inferSelect,
  imageAssets?: Array<{ asset: string; displayUrl: string }>,
): Promise<{ id: string; postUrl: string }> {
  console.log("Posting to Twitter...");
  console.log("Account:", {
    id: account.id,
    provider: account.provider,
    tokenType: account.tokenType,
  });

  if (options.debugAuth) {
    console.log(
      "Full account metadata:",
      JSON.stringify(account.metadata, null, 2),
    );
  }

  // Extract OAuth 2.0 token from metadata
  let oauth2Token = null;

  // Check if we have OAuth 2.0 metadata
  if (account.metadata && typeof account.metadata === "object") {
    // Parse the metadata as TwitterMetadata
    const metadata = account.metadata as unknown as TwitterMetadata;

    // Log the metadata structure to debug
    console.log("Account metadata keys:", Object.keys(metadata));

    // Try to get the OAuth 2.0 token from various possible locations

    // 1. Check if it's in the oauth2 object (this is where we store it in the callback)
    if (metadata.oauth2?.access_token) {
      oauth2Token = metadata.oauth2.access_token;
      console.log("Using OAuth 2.0 token from metadata.oauth2.access_token");
    }
    // 2. Check if it's directly in the accessToken field with bearer type
    else if (account.tokenType === "bearer" && account.accessToken) {
      oauth2Token = account.accessToken;
      console.log("Using OAuth 2.0 token from account.accessToken field");
    }
    // 3. Check if it's directly in the metadata as access_token
    else if (metadata.access_token) {
      oauth2Token = metadata.access_token;
      console.log("Using OAuth 2.0 token from metadata.access_token");
    }

    // If we still don't have a token, log all available fields to help debug
    if (!oauth2Token) {
      console.log("No OAuth 2.0 token found in expected locations");
      console.log(
        "Available metadata fields:",
        JSON.stringify(metadata, null, 2),
      );
    }
  }

  // If we still don't have an OAuth 2.0 token, throw an error
  if (!oauth2Token) {
    throw new Error(
      "No OAuth 2.0 token found for Twitter account. Please reconnect your Twitter account with OAuth 2.0.",
    );
  }

  console.log("Using OAuth 2.0 token:", oauth2Token.substring(0, 10) + "...");

  // Prepare media IDs if we have image assets
  let mediaIds: string[] = [];
  if (imageAssets && imageAssets.length > 0) {
    // For media uploads, we still need OAuth 1.0a credentials
    const metadata = account.metadata as unknown as TwitterMetadata;

    if (
      !metadata.oauth1 ||
      !metadata.oauth1.accessToken ||
      !metadata.oauth1.tokenSecret
    ) {
      throw new Error(
        "OAuth 1.0a credentials required for media uploads are missing",
      );
    }

    const oauth1Creds = {
      accessToken: metadata.oauth1.accessToken,
      tokenSecret: metadata.oauth1.tokenSecret,
    };

    console.log("Using OAuth 1.0a credentials for media uploads");

    // Create OAuth 1.0a instance for media uploads
    const oauth = new OAuth({
      consumer: {
        key: process.env.TWITTER_API_KEY!,
        secret: process.env.TWITTER_API_SECRET!,
      },
      signature_method: "HMAC-SHA1",
      hash_function(baseString: string, key: string) {
        return crypto
          .createHmac("sha1", key)
          .update(baseString)
          .digest("base64");
      },
    });

    // Upload each image and collect media IDs
    for (const imageAsset of imageAssets) {
      try {
        const mediaId = await uploadTwitterMedia(
          imageAsset,
          oauth,
          oauth1Creds,
        );
        mediaIds.push(mediaId);
      } catch (error) {
        console.error("Error uploading media:", error);
        throw new Error(`Failed to upload media: ${error.message}`);
      }
    }
  }

  // Prepare the request data
  const requestData: TwitterRequestData = {
    text: content,
  };

  // Add media IDs if we have any
  if (mediaIds.length > 0) {
    requestData.media = {
      media_ids: mediaIds,
    };
  }

  console.log("Request data:", requestData);

  // Make the API request to post the tweet
  const response = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${oauth2Token}`,
    },
    body: JSON.stringify(requestData),
  });

  const responseData = await response.json();
  console.log("Twitter API response:", responseData);

  // Handle different response statuses
  if (!response.ok) {
    const errorMessage =
      responseData.detail || responseData.title || "Unknown error";

    if (response.status === 401) {
      throw new Error(
        `Authentication error: ${errorMessage}. Please reconnect your Twitter account.`,
      );
    } else if (response.status === 403) {
      throw new Error(
        `Permission error: ${errorMessage}. Your account may not have write permissions.`,
      );
    } else if (response.status === 429) {
      throw new Error(
        `Rate limit exceeded: ${errorMessage}. Please try again later.`,
      );
    } else {
      throw new Error(
        `Twitter API error (${response.status}): ${errorMessage}`,
      );
    }
  }

  // Extract the tweet ID from the response
  const tweetId = responseData.data?.id;
  if (!tweetId) {
    throw new Error("Failed to get tweet ID from response");
  }

  // Get the username for constructing the tweet URL
  const metadata = account.metadata as unknown as TwitterMetadata;
  const username = metadata.username || metadata.profile?.username;
  const tweetUrl = username
    ? `https://twitter.com/${username}/status/${tweetId}`
    : `https://twitter.com/i/web/status/${tweetId}`;

  return {
    id: tweetId,
    postUrl: tweetUrl,
  };
}

// Main function
async function main() {
  try {
    // Connect to the database
    console.log(
      `🔌 Connecting to database at ${process.env.POSTGRES_URL?.replace(/:[^:]*@/, ":***@")}`,
    );

    // Get the user by email
    const userEmail = options.email || "tommy@release.com";
    console.log(`👤 Looking up user with email: ${userEmail}`);

    const userResult = await db
      .select()
      .from(user)
      .where(eq(user.email, userEmail));

    if (!userResult.length) {
      throw new Error(`User with email ${userEmail} not found`);
    }

    const userData = userResult[0];
    console.log(`✅ Found user: ${userData.name} (${userData.id})`);

    // Get the Twitter account for this user
    const accountResult = await db
      .select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.userId, userData.id),
          eq(socialAccounts.provider, "twitter"),
        ),
      );

    if (!accountResult.length) {
      throw new Error(`No Twitter account found for user ${userData.name}`);
    }

    const account = accountResult[0];
    console.log(`✅ Found Twitter account: ${account.id}`);

    // Post to Twitter
    console.log(`🐦 Posting to Twitter: "${options.content}"`);
    const result = await postToTwitter(options.content, account);

    console.log(`\n✅ Tweet posted successfully!`);
    console.log(`🔗 Tweet URL: ${result.postUrl}`);
    console.log(`🆔 Tweet ID: ${result.id}`);

    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run the main function
main();
