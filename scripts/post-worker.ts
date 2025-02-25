#!/usr/bin/env node

import { Command } from "commander";
import { db } from "../lib/db";
import postgres from "postgres";
import { scheduledPosts, socialAccounts, user } from "../lib/db/schema";
import { eq, and, lte, sql } from "drizzle-orm";
import {
  sendSlackNotification,
  createScheduledPostNotification,
  createErrorNotification,
} from "../lib/slack";
import OAuth from "oauth-1.0a";
import crypto from "crypto";

const program = new Command();

program
  .name("post-worker")
  .description("Process scheduled social media posts")
  .option("-d, --dry-run", "Run in dry-run mode (no actual posts)", false)
  .option("-l, --list", "List scheduled posts", false)
  .option("-v, --verbose", "Enable verbose logging", false)
  .option(
    "--url <url>",
    "Base URL of the application",
    process.env.NEXTAUTH_URL || "http://localhost:4001",
  )
  .option(
    "--api-key <key>",
    "API key for authentication",
    process.env.POST_WORKER_API_KEY,
  );

program.parse();

const options = program.opts();

// Get the raw postgres client for proper cleanup
const sql_client = postgres(
  process.env.POSTGRES_URL ||
    "postgres://postgres:postgres@localhost:5432/release_landing",
  {
    ssl: process.env.RELEASE_RANDOMNESS === "prod",
  },
);

// Helper function for verbose logging
function verboseLog(...args: any[]) {
  if (options.verbose) {
    console.log(...args);
  }
}

// Helper function to format dates with timezone
function formatDateWithTz(date: Date, timezone: string): string {
  return new Date(date).toLocaleString("en-US", {
    timeZone: timezone,
    dateStyle: "full",
    timeStyle: "long",
  });
}

async function listScheduledPosts() {
  try {
    verboseLog("📋 Fetching all scheduled posts...");

    // Debug the database schema
    verboseLog("🔍 Database schema check:");
    verboseLog("  - scheduledPosts table:", scheduledPosts);
    verboseLog("  - socialAccounts table:", socialAccounts);
    verboseLog("  - user table:", user);

    // Test a simple query first
    try {
      verboseLog("🔍 Testing simple query...");
      const testQuery = await db.select().from(scheduledPosts).limit(1);
      verboseLog("✅ Simple query successful, found posts:", testQuery.length);
    } catch (queryError) {
      verboseLog("❌ Simple query error:", queryError);
      throw new Error(
        `Simple query failed: ${queryError.message || queryError}`,
      );
    }

    // Find all posts, including failed ones
    verboseLog("🔍 Running full query with joins...");
    const posts = await db
      .select({
        post: scheduledPosts,
        account: socialAccounts,
        user: user,
      })
      .from(scheduledPosts)
      .leftJoin(
        socialAccounts,
        eq(scheduledPosts.socialAccountId, socialAccounts.id),
      )
      .leftJoin(user, eq(scheduledPosts.userId, user.id));

    if (posts.length === 0) {
      console.log("No posts found.");
      return;
    }

    console.log(`Found ${posts.length} posts:\n`);
    posts.forEach(({ post, account, user }) => {
      const userTz = user?.timezone || "America/Los_Angeles";
      console.log(`Post ID: ${post.id}`);
      console.log(`Platform: ${account?.provider || "hackernews"}`);
      console.log(`Status: ${post.status}`);
      console.log(`User: ${user?.name} (${user?.email})`);
      console.log(`Local time: ${formatDateWithTz(post.scheduledFor, userTz)}`);
      if (post.errorMessage) {
        console.log(`Error: ${post.errorMessage}`);
      }
      console.log(`Content: ${post.content}`);
      console.log(`Metadata:`, post.metadata);
      console.log("---\n");
    });
  } catch (error) {
    console.error("Error listing posts:", error);
    process.exit(1);
  }
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
  verboseLog("🐦 Twitter account details:", {
    id: account.id,
    providerAccountId: account.providerAccountId,
    hasToken: !!account.accessToken,
    hasRefresh: !!account.refreshToken,
    expiresAt: account.expiresAt,
    tokenType: account.tokenType,
    metadata: account.metadata,
  });

  // Get OAuth 2.0 access token
  const accessToken = account.accessToken;
  if (!accessToken) {
    throw new Error("Twitter OAuth 2.0 access token not found");
  }

  // Format the request data for v2 API
  const requestData: TwitterRequestData = {
    text: content,
  };

  if (imageAssets?.length) {
    requestData.media = {
      media_ids: imageAssets.map((asset) => asset.asset),
    };
  }

  const jsonBody = JSON.stringify(requestData);
  verboseLog(
    "📤 Twitter request data (raw JSON):\n",
    JSON.stringify(requestData, null, 2),
  );

  // Make the API request with OAuth 2.0
  const response = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "User-Agent": "Release Social Poster",
    },
    body: jsonBody,
  });

  const responseText = await response.text();
  verboseLog("📥 Twitter API raw response:", responseText);

  let responseData;
  try {
    // Check if the response is HTML (which would indicate an error)
    if (
      responseText.trim().startsWith("<html") ||
      responseText.trim().startsWith("<!DOCTYPE html")
    ) {
      verboseLog(
        "❌ Received HTML response instead of JSON:",
        responseText.substring(0, 200) + "...",
      );
      throw new Error(
        `Twitter API returned HTML instead of JSON. This usually indicates an authentication issue or network problem.`,
      );
    }

    responseData = JSON.parse(responseText);
  } catch (e) {
    verboseLog("Failed to parse response as JSON:", e);

    // Provide more detailed error information
    if (
      responseText.trim().startsWith("<html") ||
      responseText.trim().startsWith("<!DOCTYPE html")
    ) {
      throw new Error(
        `Twitter API returned HTML instead of JSON. This usually indicates an authentication issue or network problem.`,
      );
    } else {
      throw new Error(
        `Twitter API returned invalid JSON: ${responseText.substring(0, 100)}...`,
      );
    }
  }

  if (!response.ok) {
    verboseLog("❌ Twitter API error:", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      error: responseData,
      requestBody: JSON.stringify(requestData, null, 2),
    });

    // Check for specific error types
    let errorMessage = "Twitter API error";

    // Check for permission errors
    if (response.status === 403) {
      if (responseData.errors?.some((e: any) => e.code === 220)) {
        errorMessage =
          "Twitter API credentials are no longer valid. Please reconnect your Twitter account.";
      } else if (responseData.errors?.some((e: any) => e.code === 187)) {
        errorMessage =
          "Twitter API duplicate content error. Please modify your content and try again.";
      } else if (responseData.errors?.some((e: any) => e.code === 186)) {
        errorMessage =
          "Twitter API content too long. Please shorten your content and try again.";
      } else if (
        responseData.errors?.some((e: any) => e.message?.includes("permission"))
      ) {
        errorMessage =
          "Twitter API permission denied. Please check your account permissions and ensure you've granted write access.";
      } else {
        errorMessage = `Twitter API permission error: ${responseData.detail || responseData.errors?.[0]?.message || response.statusText}`;
      }
    } else if (response.status === 401) {
      errorMessage =
        "Twitter API authentication failed. Please reconnect your Twitter account.";
    } else {
      errorMessage = `Twitter API error: ${responseData.detail || responseData.errors?.[0]?.message || response.statusText}`;
    }

    throw new Error(errorMessage);
  }

  const tweetId = responseData.data.id;
  const postUrl = `https://x.com/i/web/status/${tweetId}`;

  verboseLog("✅ Tweet posted successfully:", { tweetId, postUrl });
  return { id: tweetId, postUrl };
}

// Helper function to post to LinkedIn
async function postToLinkedIn(
  content: string,
  account: typeof socialAccounts.$inferSelect,
  imageAssets?: Array<{ asset: string; displayUrl: string }>,
): Promise<{ id: string; postUrl: string }> {
  // If we have image assets, check their status first
  if (imageAssets?.length) {
    // Check status of each image and wait for them to be ready
    for (const asset of imageAssets) {
      let isReady = false;
      let attempts = 0;
      const maxAttempts = 20;

      while (!isReady && attempts < maxAttempts) {
        const assetId = asset.asset.split(":").pop();
        const statusResponse = await fetch(
          `https://api.linkedin.com/v2/assets/${assetId}`,
          {
            headers: {
              Authorization: `Bearer ${account.accessToken}`,
              "X-Restli-Protocol-Version": "2.0.0",
              "LinkedIn-Version": "202304",
            },
          },
        );

        if (!statusResponse.ok) {
          const errorText = await statusResponse.text();
          verboseLog("❌ LinkedIn image status check error:", errorText);

          // Check if the response is HTML
          if (
            errorText.trim().startsWith("<html") ||
            errorText.trim().startsWith("<!DOCTYPE html")
          ) {
            throw new Error(
              `LinkedIn API returned HTML instead of JSON when checking image status. This usually indicates an authentication issue or network problem. Status: ${statusResponse.status}`,
            );
          }

          throw new Error(
            `Failed to check LinkedIn image status: ${statusResponse.status}. Response: ${errorText.substring(0, 100)}...`,
          );
        }

        let status;
        try {
          status = await statusResponse.json();
        } catch (e) {
          verboseLog(
            "Failed to parse LinkedIn image status response as JSON:",
            e,
          );
          const errorText = await statusResponse.text();
          throw new Error(
            `LinkedIn API returned invalid JSON for image status. Response: ${errorText.substring(0, 100)}...`,
          );
        }

        if (status.status === "ALLOWED") {
          isReady = true;
        } else {
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      if (!isReady) {
        throw new Error(
          `LinkedIn image ${asset.asset} not ready after ${maxAttempts} attempts`,
        );
      }
    }
  }

  const body = {
    author: `urn:li:person:${account.providerAccountId}`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: content,
        },
        shareMediaCategory: imageAssets?.length ? "IMAGE" : "NONE",
        ...(imageAssets?.length
          ? {
              media: imageAssets.map((asset) => ({
                status: "READY",
                description: { text: "Image" },
                media: asset.asset,
                title: { text: "Image" },
              })),
            }
          : {}),
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${account.accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202304",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    // Get the response text to provide better error information
    const errorText = await response.text();
    verboseLog("❌ LinkedIn API error response:", errorText);

    // Check if the response is HTML (which would indicate an error)
    if (
      errorText.trim().startsWith("<html") ||
      errorText.trim().startsWith("<!DOCTYPE html")
    ) {
      throw new Error(
        `LinkedIn API returned HTML instead of JSON. This usually indicates an authentication issue or network problem. Status: ${response.status}`,
      );
    }

    // Try to parse as JSON for more detailed error info
    try {
      const errorData = JSON.parse(errorText);
      throw new Error(
        `LinkedIn API error: ${errorData.message || errorData.error || JSON.stringify(errorData)}`,
      );
    } catch (e) {
      // If parsing fails, return the status and a snippet of the error text
      throw new Error(
        `LinkedIn API error: ${response.status}. Response: ${errorText.substring(0, 100)}...`,
      );
    }
  }

  // Parse the response as JSON
  let responseData;
  try {
    responseData = await response.json();
  } catch (e) {
    verboseLog("Failed to parse LinkedIn response as JSON:", e);
    const errorText = await response.text();
    throw new Error(
      `LinkedIn API returned invalid JSON. Response: ${errorText.substring(0, 100)}...`,
    );
  }

  const postId = responseData.id.split(":").pop();
  const postUrl = `https://www.linkedin.com/feed/update/${postId}`;

  return { id: responseData.id, postUrl };
}

async function processScheduledPosts() {
  verboseLog("🔍 Looking for posts due for processing...");

  // Get posts that are due in their respective user's timezone
  const duePosts = await db
    .select({
      post: scheduledPosts,
      account: socialAccounts,
      user: user,
    })
    .from(scheduledPosts)
    .leftJoin(
      socialAccounts,
      eq(scheduledPosts.socialAccountId, socialAccounts.id),
    )
    .leftJoin(user, eq(scheduledPosts.userId, user.id))
    .where(
      and(
        eq(scheduledPosts.status, "scheduled"),
        lte(scheduledPosts.scheduledFor, new Date()), // Only get posts that are actually due
      ),
    )
    .execute({ timeout: 5000 }); // Add 5 second timeout

  verboseLog(`Found ${duePosts.length} posts due for processing`);

  for (const { post, account, user } of duePosts) {
    try {
      // Get platform and user timezone from metadata or defaults
      const platform =
        (post.metadata as { platform?: string })?.platform ||
        account?.provider ||
        "unknown";
      const userTz = user?.timezone || "America/Los_Angeles";
      const isHNReminder =
        platform === "hackernews" &&
        (post.metadata as { type?: string })?.type === "reminder";

      verboseLog("\n📝 Processing post:", {
        id: post.id,
        platform,
        scheduledFor: formatDateWithTz(post.scheduledFor, userTz),
        user: `${user?.name} (${user?.email})`,
        type: isHNReminder ? "HN Reminder" : "Social Post",
        hasImages: Boolean((post.metadata as any)?.imageAssets?.length),
      });

      if (isHNReminder) {
        verboseLog("📰 Processing Hacker News reminder...");
        // Send HN reminder notification with user's timezone
        await sendSlackNotification(
          createScheduledPostNotification({
            platform,
            content: post.content,
            scheduledFor: post.scheduledFor,
            metadata: {
              ...(post.metadata as {
                url?: string;
                type?: string;
                userEmail?: string;
                userName?: string;
              }),
              userEmail: user?.email,
              userName: user?.name,
              timezone: userTz,
            },
          }),
        );

        verboseLog("✅ Hacker News reminder sent successfully");

        // Mark as completed
        await db
          .update(scheduledPosts)
          .set({
            status: "posted",
            updatedAt: new Date(),
          })
          .where(eq(scheduledPosts.id, post.id));

        continue;
      }

      if (!account) {
        throw new Error("Social account not found");
      }

      // Handle Twitter/LinkedIn posting
      if (!options.dryRun) {
        verboseLog(`🚀 Posting to ${platform}...`);
        let postUrl: string | undefined;

        if (platform === "twitter") {
          verboseLog("🐦 Processing Twitter post...");
          const imageAssets = (post.metadata?.imageAssets || []) as Array<{
            asset: string;
            displayUrl: string;
          }>;
          if (imageAssets.length) {
            verboseLog(`Found ${imageAssets.length} images to upload`);
          }
          const result = await postToTwitter(
            post.content,
            account,
            imageAssets,
          );
          postUrl = result.postUrl;
          verboseLog("✅ Twitter post successful:", { postUrl });
        } else if (platform === "linkedin") {
          verboseLog("💼 Processing LinkedIn post...");
          const imageAssets = (post.metadata?.imageAssets || []) as Array<{
            asset: string;
            displayUrl: string;
          }>;
          if (imageAssets.length) {
            verboseLog(`Found ${imageAssets.length} images to upload`);
          }
          const result = await postToLinkedIn(
            post.content,
            account,
            imageAssets,
          );
          postUrl = result.postUrl;
          verboseLog("✅ LinkedIn post successful:", { postUrl });
        }

        verboseLog("📝 Updating post status in database...");
        // Mark as posted with timezone-aware timestamp
        await db
          .update(scheduledPosts)
          .set({
            status: "posted",
            updatedAt: sql`timezone(${userTz}, now())`,
          })
          .where(eq(scheduledPosts.id, post.id));

        verboseLog("📨 Sending success notification...");
        // Send success notification with user's timezone
        await sendSlackNotification(
          createScheduledPostNotification({
            platform,
            content: post.content,
            scheduledFor: post.scheduledFor,
            metadata: {
              ...(post.metadata as {
                url?: string;
                type?: string;
                userEmail?: string;
                userName?: string;
              }),
              userEmail: user?.email,
              userName: user?.name,
              timezone: userTz,
              postUrl,
            },
          }),
        );

        verboseLog("✅ Post processing completed successfully");
      } else {
        verboseLog(`[DRY RUN] Would post to ${platform}:`, {
          content: post.content,
          scheduledFor: formatDateWithTz(post.scheduledFor, userTz),
          hasImages: Boolean((post.metadata as any)?.imageAssets?.length),
        });
      }
    } catch (error) {
      console.error(`❌ Error processing post ${post.id}:`, error);

      const userTz = user?.timezone || "America/Los_Angeles";

      verboseLog("📝 Updating post status to failed...");
      // Update post status with timezone-aware timestamp
      await db
        .update(scheduledPosts)
        .set({
          status: "failed",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          updatedAt: sql`timezone(${userTz}, now())`,
        })
        .where(eq(scheduledPosts.id, post.id));

      // Get platform for error message
      const platform =
        (post.metadata as { platform?: string })?.platform ||
        account?.provider ||
        "unknown";

      verboseLog("📨 Sending failure notification...");

      // Create the error notification
      const errorNotification = createErrorNotification({
        platform,
        content: post.content,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        scheduledFor: post.scheduledFor,
        metadata: {
          ...(post.metadata as {
            url?: string;
            type?: string;
            userEmail?: string;
            userName?: string;
          }),
          userEmail: user?.email,
          userName: user?.name,
          timezone: userTz,
        },
      });

      // Log the notification for debugging
      verboseLog(
        "Error notification payload:",
        JSON.stringify(errorNotification, null, 2),
      );

      // Send the notification with better error handling
      try {
        await sendSlackNotification(errorNotification);
        verboseLog("✅ Error notification sent to Slack successfully");
      } catch (slackError) {
        console.error(
          "❌ Failed to send error notification to Slack:",
          slackError,
        );
        // Try a simplified notification as fallback
        try {
          await sendSlackNotification({
            text: `❌ Error posting to ${platform}: ${error instanceof Error ? error.message : "Unknown error"} for user ${user?.email || "unknown"}`,
          });
          verboseLog("✅ Simplified error notification sent to Slack");
        } catch (fallbackError) {
          console.error(
            "❌ Failed to send simplified error notification to Slack:",
            fallbackError,
          );
        }
      }
    }
  }
}

async function runPostWorker() {
  try {
    verboseLog("\n=== 🚀 Post Worker Starting ===");
    verboseLog("⚙️ Configuration:", {
      dryRun: options.dryRun,
      list: options.list,
      verbose: options.verbose,
      url: options.url,
    });

    // Debug database connection
    verboseLog("📊 Database URL:", process.env.POSTGRES_URL);

    // Debug environment variables
    verboseLog("🔑 Environment variables check:");
    verboseLog(
      "  - POST_WORKER_API_KEY exists:",
      !!process.env.POST_WORKER_API_KEY,
    );
    verboseLog(
      "  - TWITTER_CLIENT_ID exists:",
      !!process.env.TWITTER_CLIENT_ID,
    );
    verboseLog(
      "  - TWITTER_CLIENT_SECRET exists:",
      !!process.env.TWITTER_CLIENT_SECRET,
    );
    verboseLog(
      "  - SLACK_WEBHOOK_URL exists:",
      !!process.env.SLACK_WEBHOOK_URL,
    );
    verboseLog("  - NEXTAUTH_URL exists:", !!process.env.NEXTAUTH_URL);
    verboseLog(
      "  - RELEASE_RANDOMNESS exists:",
      !!process.env.RELEASE_RANDOMNESS,
    );

    // Test database connection
    try {
      verboseLog("🔍 Testing database connection...");
      const testQuery = await db.execute(sql`SELECT 1 as test`);
      verboseLog("✅ Database connection successful:", testQuery);
    } catch (dbError) {
      verboseLog("❌ Database connection error:", dbError);
      throw new Error(
        `Database connection failed: ${dbError.message || dbError}`,
      );
    }

    // If we're just listing posts, do that and return
    if (options.list) {
      await listScheduledPosts();
      await sql_client.end();
      verboseLog("✅ List operation completed");
      process.exit(0);
      return;
    }

    if (options.dryRun) {
      console.log("🔍 Running in dry-run mode - no actual posts will be made");
    }

    console.log("⏳ Running post worker...");
    await processScheduledPosts();

    // Close database connection and exit
    verboseLog("\n=== 🏁 Post Worker Completed ===");
    await sql_client.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Post worker error:", error);
    await sql_client.end();
    process.exit(1);
  }
}

runPostWorker();
