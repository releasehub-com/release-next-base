import { db } from "../lib/db";
import { scheduledPosts, user } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

async function addDummyFailedPost() {
  try {
    console.log("Adding dummy failed post to the database...");

    // Get the user with email tommy@release.com
    const users = await db
      .select()
      .from(user)
      .where(eq(user.email, "tommy@release.com"))
      .limit(1);

    if (users.length === 0) {
      console.error(
        "User with email tommy@release.com not found in the database.",
      );
      process.exit(1);
    }

    const adminUser = users[0];
    console.log(
      `Using user: ${adminUser.name || adminUser.email} (${adminUser.email})`,
    );

    // Create a dummy failed post
    const now = new Date();
    const scheduledTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

    const dummyPost = {
      id: uuidv4(),
      userId: adminUser.id,
      socialAccountId: null, // This can be null for testing
      content: "This is a dummy failed post for testing error message display",
      scheduledFor: scheduledTime,
      status: "failed",
      errorMessage:
        "API rate limit exceeded. The platform rejected this post due to too many requests. Please try again later or contact support if this issue persists.",
      metadata: {
        platform: "twitter",
        pageContext: {
          title: "Test Failed Post",
          url: "https://example.com/test-post",
          description: "This is a test post that failed to be published",
        },
        imageAssets: [],
        scheduledInTimezone: adminUser.timezone || "America/Los_Angeles",
        userEmail: adminUser.email,
        userName: adminUser.name || adminUser.email,
      },
      createdAt: now,
      updatedAt: now,
    };

    // Insert the post into the database
    await db.insert(scheduledPosts).values(dummyPost);

    console.log("Dummy failed post added successfully!");
    console.log("Post details:");
    console.log(`- ID: ${dummyPost.id}`);
    console.log(`- Status: ${dummyPost.status}`);
    console.log(`- Error Message: ${dummyPost.errorMessage}`);
    console.log(`- Scheduled For: ${scheduledTime.toLocaleString()}`);
    console.log(`- Platform: ${dummyPost.metadata.platform}`);
  } catch (error) {
    console.error("Error adding dummy failed post:", error);
  } finally {
    process.exit(0);
  }
}

// Run the function
addDummyFailedPost();
