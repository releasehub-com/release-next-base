import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scheduledPosts, socialAccounts } from "@/lib/db/schema";
import { eq, and, lte } from "drizzle-orm";
import OAuth from "oauth-1.0a";
import crypto from "crypto";

interface TwitterApiResponse {
  data: {
    text: string;
    id: string;
    edit_history_tweet_ids: string[];
  }
}

interface TwitterErrorResponse {
  error: {
    message: string;
    code: number;
  }
}

type TwitterResponse = TwitterApiResponse | TwitterErrorResponse;

interface WorkerResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

// Helper function to simulate posting to Twitter
async function mockPostToTwitter(content: string): Promise<void> {
  console.log("MOCK: Would post to Twitter:", content);
}

// Helper function to simulate posting to LinkedIn
async function mockPostToLinkedIn(content: string): Promise<void> {
  console.log("MOCK: Would post to LinkedIn:", content);
}

// Helper function to post to Twitter
async function postToTwitter(
  content: string,
  account: typeof socialAccounts.$inferSelect,
  imageAssets?: (string | { asset: string; displayUrl: string })[],
): Promise<TwitterResponse> {
  try {
    // Validate access token
    if (!account.accessToken) {
      throw new Error("Twitter access token is missing");
    }

    const isDebug = true; // Enable debug for this function
    
    if (isDebug) {
      console.log("🔑 Twitter token info:", {
        tokenExists: !!account.accessToken,
        tokenLength: account.accessToken.length,
        accountId: account.providerAccountId,
        refreshTokenExists: !!account.refreshToken,
        tokenType: account.tokenType
      });
    }

    // Format the request body according to Twitter v2 API
    const requestBody: any = {
      text: content,
    };

    // Add media IDs if provided - format according to v2 API spec
    if (imageAssets?.length) {
      requestBody.media = {
        media_ids: imageAssets.map((asset) =>
          typeof asset === "string" ? asset : asset.asset,
        ),
      };
    }

    if (isDebug) {
      console.log("📝 Twitter request body:", {
        contentLength: content.length,
        mediaCount: imageAssets?.length || 0,
        mediaIds: requestBody.media?.media_ids
      });
    }

    // Check if token needs refresh
    const now = Math.floor(Date.now() / 1000);
    if (account.expiresAt && now >= new Date(account.expiresAt).getTime() / 1000) {
      if (isDebug) {
        console.log("🔄 Token expired, attempting refresh...");
      }

      if (!account.refreshToken) {
        throw new Error("Refresh token is missing");
      }

      const refreshResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: account.refreshToken,
        }).toString(),
      });

      if (!refreshResponse.ok) {
        console.error("Failed to refresh token:", await refreshResponse.text());
        throw new Error("Twitter authentication failed. Please reconnect your Twitter account.");
      }

      const refreshData = await refreshResponse.json();
      
      if (isDebug) {
        console.log("🔑 Refresh successful, updating token...");
      }

      // Update the account with new tokens
      await db.update(socialAccounts)
        .set({
          accessToken: refreshData.access_token,
          refreshToken: refreshData.refresh_token,
          expiresAt: new Date(Date.now() + refreshData.expires_in * 1000),
          updatedAt: new Date(),
        })
        .where(eq(socialAccounts.id, account.id));

      // Update the token for the current request
      account.accessToken = refreshData.access_token;
    }

    // Make the API request with OAuth 2.0 Bearer token
    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${account.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();

    if (isDebug) {
      console.log("✨ Twitter API response:", {
        status: response.status,
        ok: response.ok,
        data: responseData
      });
    }

    if (!response.ok) {
      console.error("Twitter API error:", {
        status: response.status,
        error: responseData.detail || responseData.message,
        code: responseData.status,
      });

      // Handle specific error cases
      if (response.status === 401) {
        throw new Error("Twitter authentication failed. Please reconnect your Twitter account.");
      } else if (response.status === 403) {
        throw new Error("Twitter API permission denied. Please check your account permissions.");
      } else if (responseData.errors?.[0]?.message) {
        throw new Error(`Twitter API error: ${responseData.errors[0].message}`);
      } else {
        throw new Error(responseData.detail || "Failed to post to Twitter");
      }
    }

    console.log("Twitter post successful:", { id: responseData.data?.id });
    return responseData as TwitterResponse;
  } catch (error) {
    console.error("Twitter posting error:", error);
    throw error;
  }
}

// Helper function to post to LinkedIn
async function postToLinkedIn(
  content: string,
  account: typeof socialAccounts.$inferSelect,
  imageAssets?: Array<string | { asset: string }>,
): Promise<void> {
  // If we have image assets, check their status first
  if (imageAssets?.length) {
    // Extract just the URN from the asset object if it's an object
    const assetUrns = imageAssets.map((asset) =>
      typeof asset === "string" ? asset : asset.asset,
    );

    // Check status of each image and wait for them to be ready
    for (const urn of assetUrns) {
      let isReady = false;
      let attempts = 0;
      const maxAttempts = 20; // Increased from 10 to 20 attempts

      while (!isReady && attempts < maxAttempts) {
        // Extract just the asset ID from the URN (everything after the last colon)
        const assetId = urn.split(":").pop();

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
          console.error("LinkedIn asset status check error:", {
            status: statusResponse.status,
            assetId,
          });
          throw new Error(
            `Failed to check LinkedIn image status: ${statusResponse.status}`,
          );
        }

        const status = await statusResponse.json();
        console.log("LinkedIn asset status check:", {
          assetId,
          status: status.status,
        });

        if (status.status === "ALLOWED") {
          isReady = true;
        } else {
          attempts++;
          // Wait longer between attempts (2 seconds instead of 1)
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      if (!isReady) {
        throw new Error(
          `LinkedIn image ${urn} not ready after ${maxAttempts} attempts`,
        );
      }
    }
  }

  const body: any = {
    author: `urn:li:person:${account.providerAccountId}`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: content,
        },
        shareMediaCategory: imageAssets?.length ? "IMAGE" : "NONE",
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  // Add images if provided and not empty
  if (imageAssets?.length) {
    // Extract just the URN from the asset object if it's an object
    const assetUrns = imageAssets.map((asset) =>
      typeof asset === "string" ? asset : asset.asset,
    );

    body.specificContent["com.linkedin.ugc.ShareContent"].media = assetUrns.map(
      (urn) => ({
        status: "READY",
        description: {
          text: "Image",
        },
        media: urn,
        title: {
          text: "Image",
        },
      }),
    );
  }

  console.log("Posting to LinkedIn:", {
    postId: content.substring(0, 20) + "...",
    hasMedia: !!imageAssets?.length,
  });

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
    const error = await response.text();
    console.error("LinkedIn API error:", {
      status: response.status,
      error: error.substring(0, 100) + "...",
    });
    throw new Error(`LinkedIn API error: ${response.status}`);
  }

  const responseData = await response.json();
  console.log("LinkedIn post successful:", { id: responseData.id });
}

export async function POST(request: Request) {
  try {
    // Get API key and debug flags from headers
    const apiKey = request.headers.get("x-api-key");
    const isDryRun = request.headers.get("x-dry-run") === "1";
    const isDebug = request.headers.get("x-debug") === "1";

    if (apiKey !== process.env.POST_WORKER_API_KEY && !isDryRun) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find posts that are scheduled and due
    const now = new Date();
    const debugInfo: any = {};
    
    if (isDebug) {
      debugInfo.currentTime = {
        iso: now.toISOString(),
        pst: now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
        utc: now.toUTCString()
      };
    }

    // Query for all scheduled posts first to see what's in the database
    const allScheduledPosts = await db
      .select({
        post: scheduledPosts,
        account: socialAccounts,
      })
      .from(scheduledPosts)
      .leftJoin(
        socialAccounts,
        eq(scheduledPosts.socialAccountId, socialAccounts.id),
      )
      .where(
        eq(scheduledPosts.status, "scheduled"),
      );

    if (isDebug) {
      debugInfo.allScheduledPosts = {
        count: allScheduledPosts.length,
        posts: allScheduledPosts.map(({ post, account }) => ({
          id: post.id,
          scheduledFor: new Date(post.scheduledFor).toLocaleString("en-US", {
            timeZone: "America/Los_Angeles",
          }),
          status: post.status,
          platform: post.metadata?.platform,
          accountId: account?.id,
          provider: account?.provider,
        }))
      };
    }

    const duePosts = await db
      .select({
        post: scheduledPosts,
        account: socialAccounts,
      })
      .from(scheduledPosts)
      .leftJoin(
        socialAccounts,
        eq(scheduledPosts.socialAccountId, socialAccounts.id),
      )
      .where(
        and(
          eq(scheduledPosts.status, "scheduled"),
          lte(scheduledPosts.scheduledFor, now),
        ),
      );

    if (isDebug) {
      debugInfo.duePosts = {
        count: duePosts.length,
        posts: duePosts.map(({ post, account }) => ({
          id: post.id,
          scheduledFor: new Date(post.scheduledFor).toLocaleString("en-US", {
            timeZone: "America/Los_Angeles",
          }),
          platform: post.metadata?.platform,
          accountId: account?.id,
          provider: account?.provider,
          hasAccessToken: !!account?.accessToken,
          contentLength: post.content.length,
          hasImages: !!(post.metadata?.imageAssets as any[])?.length
        }))
      };
    }

    const results = [];
    let successCount = 0;
    let failureCount = 0;

    // Process each due post
    for (const { post, account } of duePosts) {
      try {
        if (!account) {
          throw new Error("Social account not found");
        }

        if (isDebug) {
          console.log(`\n🔄 Processing post ${post.id}:`, {
            platform: post.metadata?.platform,
            accountId: account.id,
            provider: account.provider,
            scheduledFor: new Date(post.scheduledFor).toLocaleString(),
            contentLength: post.content.length,
            hasAccessToken: !!account.accessToken,
            tokenLength: account.accessToken?.length,
            hasRefreshToken: !!account.refreshToken,
            imageCount: (post.metadata?.imageAssets as any[])?.length || 0
          });
        }

        // Post to appropriate platform
        if (isDryRun) {
          // Simulate posting in dry-run mode
          if (account.provider === "twitter") {
            await mockPostToTwitter(post.content);
          } else if (account.provider === "linkedin") {
            await mockPostToLinkedIn(post.content);
          }

          // In dry-run mode, just add success result without updating database
          results.push({
            id: post.id,
            status: "success",
            dryRun: true,
          });
          successCount++;
        } else {
          // Actually post in normal mode
          if (account.provider === "twitter") {
            // Extract image assets from metadata
            const imageAssets = post.metadata?.imageAssets as
              | string[]
              | undefined;

            if (isDebug) {
              console.log("🐦 Twitter post attempt:", {
                postId: post.id,
                contentPreview: post.content.substring(0, 50) + "...",
                imageCount: imageAssets?.length || 0,
                imageAssets: imageAssets
              });
            }

            const twitterResponse = await postToTwitter(post.content, account, imageAssets);

            if (isDebug) {
              console.log("🐦 Twitter API response:", {
                postId: post.id,
                success: !!(twitterResponse as any).data,
                data: (twitterResponse as any).data,
                errors: (twitterResponse as any).errors
              });
            }

            if (twitterResponse instanceof Error) {
              throw twitterResponse;
            }
          } else if (account.provider === "linkedin") {
            // Extract image assets from metadata if present
            const imageAssets = post.metadata?.imageAssets as
              | string[]
              | undefined;

            if (isDebug) {
              console.log("💼 LinkedIn post attempt:", {
                postId: post.id,
                contentPreview: post.content.substring(0, 50) + "...",
                imageCount: imageAssets?.length || 0,
                imageAssets: imageAssets
              });
            }

            await postToLinkedIn(post.content, account, imageAssets);
          }

          // Update post status to posted only after successful posting
          await db
            .update(scheduledPosts)
            .set({
              status: "posted",
              updatedAt: now,
            })
            .where(eq(scheduledPosts.id, post.id));

          results.push({
            id: post.id,
            status: "success",
            dryRun: false,
          });
          successCount++;
        }
      } catch (error) {
        failureCount++;
        if (isDebug) {
          console.error(`❌ Error posting ${post.id}:`, {
            error: error instanceof Error ? {
              message: error.message,
              stack: error.stack,
              name: error.name
            } : error,
            post: {
              id: post.id,
              platform: post.metadata?.platform,
              scheduledFor: new Date(post.scheduledFor).toLocaleString()
            }
          });
        } else {
          console.error(`Error posting ${post.id}:`, error);
        }

        // Only update status to failed when not in dry-run mode
        if (!isDryRun) {
          await db
            .update(scheduledPosts)
            .set({
              status: "failed",
              errorMessage:
                error instanceof Error ? error.message : "Unknown error",
              updatedAt: now,
            })
            .where(eq(scheduledPosts.id, post.id));
        }

        results.push({
          id: post.id,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
          dryRun: isDryRun,
        });
      }
    }

    if (isDebug) {
      console.log("\n📊 Summary:", {
        total: duePosts.length,
        successful: successCount,
        failed: failureCount,
        results
      });
    } else {
      console.log(`Summary: ${successCount} posts were successful, ${failureCount} posts failed`);
    }

    return NextResponse.json({ 
      results,
      debug: isDebug ? debugInfo : undefined 
    });
  } catch (error) {
    console.error("Worker error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
