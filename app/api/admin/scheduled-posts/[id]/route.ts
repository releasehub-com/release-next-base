import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { user, scheduledPosts } from "@/lib/db/schema";
import { eq, and, or } from "drizzle-orm";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's ID from the database
    const userResult = await db
      .select()
      .from(user)
      .where(eq(user.email, session.user.email));

    if (!userResult.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userResult[0].id;

    // Delete the post, ensuring it belongs to the user and has the correct status
    const result = await db
      .delete(scheduledPosts)
      .where(
        and(
          eq(scheduledPosts.id, params.id),
          eq(scheduledPosts.userId, userId),
          or(
            eq(scheduledPosts.status, "scheduled"),
            eq(scheduledPosts.status, "failed"),
          ),
        ),
      )
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { error: "Post not found, unauthorized, or cannot be deleted" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting scheduled post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's ID from the database
    const userResult = await db
      .select()
      .from(user)
      .where(eq(user.email, session.user.email));

    if (!userResult.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userResult[0].id;

    // Get the request body
    const body = await request.json();
    const { content, scheduledFor, metadata } = body;

    if (!content || !scheduledFor) {
      return NextResponse.json(
        { error: "Content and scheduledFor are required" },
        { status: 400 },
      );
    }

    // Validate that the scheduled time is in the future
    const scheduledTime = new Date(scheduledFor);
    const currentTime = new Date();
    
    console.log("Date comparison:", {
      scheduledTime: scheduledTime.toISOString(),
      currentTime: currentTime.toISOString(),
      scheduledTimeMs: scheduledTime.getTime(),
      currentTimeMs: currentTime.getTime(),
      difference: scheduledTime.getTime() - currentTime.getTime(),
      isInFuture: scheduledTime.getTime() > currentTime.getTime(),
      serverTimezone: "UTC" // Server always uses UTC
    });
    
    // Add a small buffer (5 minutes) to account for processing time
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    if (scheduledTime.getTime() <= currentTime.getTime() + bufferTime) {
      return NextResponse.json(
        { 
          error: "Scheduled time must be at least 5 minutes in the future",
          details: {
            scheduledTime: scheduledTime.toISOString(),
            currentTime: currentTime.toISOString(),
            difference: scheduledTime.getTime() - currentTime.getTime(),
            message: "Please schedule the post at least 5 minutes in the future."
          }
        },
        { status: 400 },
      );
    }

    // First check if the post exists and can be edited
    const existingPost = await db
      .select()
      .from(scheduledPosts)
      .where(
        and(
          eq(scheduledPosts.id, params.id),
          eq(scheduledPosts.userId, userId),
        ),
      )
      .limit(1);

    if (!existingPost.length) {
      return NextResponse.json(
        { error: "Post not found or unauthorized" },
        { status: 404 },
      );
    }

    if (existingPost[0].status === "posted") {
      return NextResponse.json(
        { error: "Cannot edit a post that has already been posted" },
        { status: 400 },
      );
    }

    // Update the post if it belongs to the user and has the correct status
    const updateData: any = {
      content,
      scheduledFor: scheduledTime,
      updatedAt: new Date(),
    };

    // Include metadata in the update if provided
    if (metadata) {
      // Ensure metadata is properly formatted
      try {
        console.log("Received metadata:", JSON.stringify(metadata, null, 2));
        
        // Validate that required fields are present
        if (!metadata.platform) {
          return NextResponse.json(
            { error: "Metadata must include a platform" },
            { status: 400 },
          );
        }
        
        // Merge with existing metadata to preserve any fields not included in the update
        const existingMetadata = existingPost[0].metadata as Record<string, any> || {};
        console.log("Existing metadata:", JSON.stringify(existingMetadata, null, 2));
        
        const pageContext = {
          ...(existingMetadata.pageContext || {}),
          ...(metadata.pageContext || {}),
        };
        
        updateData.metadata = {
          ...existingMetadata,
          ...metadata,
          pageContext,
        };
        
        console.log("Final metadata:", JSON.stringify(updateData.metadata, null, 2));
      } catch (metadataError) {
        console.error("Error processing metadata:", metadataError);
        return NextResponse.json(
          { error: "Invalid metadata format" },
          { status: 400 },
        );
      }
    }

    const result = await db
      .update(scheduledPosts)
      .set(updateData)
      .where(
        and(
          eq(scheduledPosts.id, params.id),
          eq(scheduledPosts.userId, userId),
          or(
            eq(scheduledPosts.status, "scheduled"),
            eq(scheduledPosts.status, "failed"),
          ),
        ),
      )
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { error: "Post not found, unauthorized, or cannot be edited" },
        { status: 404 },
      );
    }

    return NextResponse.json({ post: result[0] });
  } catch (error) {
    console.error("Error updating scheduled post:", error);
    return NextResponse.json(
      { error: "Failed to update scheduled post" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's ID from the database
    const userResult = await db
      .select()
      .from(user)
      .where(eq(user.email, session.user.email));

    if (!userResult.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userResult[0].id;

    // Get the post and verify it belongs to the user and is in failed state
    const post = await db
      .select()
      .from(scheduledPosts)
      .where(
        and(
          eq(scheduledPosts.id, params.id),
          eq(scheduledPosts.userId, userId),
          eq(scheduledPosts.status, "failed"),
        ),
      )
      .limit(1);

    if (!post.length) {
      return NextResponse.json(
        { error: "Post not found, unauthorized, or not in failed state" },
        { status: 404 },
      );
    }

    // Reset the post status to scheduled and clear error message
    const result = await db
      .update(scheduledPosts)
      .set({
        status: "scheduled",
        errorMessage: null,
        updatedAt: new Date(),
      })
      .where(eq(scheduledPosts.id, params.id))
      .returning();

    return NextResponse.json({ post: result[0] });
  } catch (error) {
    console.error("Error retrying failed post:", error);
    return NextResponse.json(
      { error: "Failed to retry post" },
      { status: 500 },
    );
  }
}
