import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { scheduledPosts, user } from "@/lib/db/schema";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the admin user to get their ID
    const adminUser = await db
      .select()
      .from(user)
      .where(eq(user.email, session.user.email))
      .limit(1);

    if (!adminUser.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { title, url, scheduledFor } = await request.json();

    if (!title || !url || !scheduledFor) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Store the scheduled reminder in the database
    await db.insert(scheduledPosts).values({
      id: nanoid(),
      userId: adminUser[0].id,
      content: title, // Store the HN title as content
      scheduledFor: new Date(scheduledFor),
      metadata: {
        platform: "hackernews",
        url,
        type: "reminder", // Indicate this is a reminder, not a direct post
        userEmail: session.user.email,
        userName: session.user.name,
      },
      status: "scheduled",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error scheduling HN reminder:", error);
    return NextResponse.json(
      { error: "Failed to schedule reminder" },
      { status: 500 },
    );
  }
}
