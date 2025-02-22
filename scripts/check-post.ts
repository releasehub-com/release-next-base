import { db } from "@/lib/db";
import { scheduledPosts, socialAccounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function checkPost() {
  try {
    const post = await db
      .select()
      .from(scheduledPosts)
      .where(eq(scheduledPosts.id, "af4424ed-609b-4ce7-831b-271884a71ab8"));

    console.log("Post details:", JSON.stringify(post[0], null, 2));

    if (post[0]) {
      const account = await db
        .select()
        .from(socialAccounts)
        .where(eq(socialAccounts.id, post[0].socialAccountId));

      console.log(
        "\nLinked social account:",
        JSON.stringify(account[0], null, 2),
      );
    }
  } catch (error) {
    console.error("Error checking post:", error);
  }
}

checkPost();
