import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { socialAccounts, user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET() {
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

    // Get social accounts using the user's ID
    const accounts = await db
      .select()
      .from(socialAccounts)
      .where(eq(socialAccounts.userId, userId));

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        error: "Database error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("id");

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 },
      );
    }

    // Get the account before deleting to check the provider
    const account = await db
      .select()
      .from(socialAccounts)
      .where(eq(socialAccounts.id, accountId))
      .limit(1);

    await db.delete(socialAccounts).where(eq(socialAccounts.id, accountId));

    // Clear OAuth-related cookies
    const cookieStore = cookies();
    if (account[0]?.provider === "twitter") {
      cookieStore.delete("twitter_code_verifier");
      cookieStore.delete("twitter_oauth_token");
      cookieStore.delete("twitter_oauth_token_secret");
      cookieStore.delete("twitter_state_v1");
      cookieStore.delete("twitter_oauth_token_secret_v1");
    }
    // Note: LinkedIn doesn't use cookies for OAuth state management

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        error: "Database error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
