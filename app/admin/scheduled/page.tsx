import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { user, scheduledPosts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import ScheduledPostsPageClient from "./ScheduledPostsPage";

interface ScheduledPost {
  id: string;
  content: string;
  scheduledFor: string;
  status: "scheduled" | "posted" | "failed";
  errorMessage?: string;
  metadata: {
    platform: string;
    pageContext: {
      title: string;
      url: string;
      description?: string;
    };
    imageAssets?: {
      asset: string;
      displayUrl: string;
    }[];
  };
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export default async function ScheduledPostsPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return <div>Unauthorized</div>;
  }

  // Get the user's ID from the database
  const userResult = await db
    .select()
    .from(user)
    .where(eq(user.email, session.user.email));

  if (!userResult.length) {
    return <div>User not found</div>;
  }

  // Get posts with user information
  const posts = await db
    .select({
      id: scheduledPosts.id,
      content: scheduledPosts.content,
      scheduledFor: scheduledPosts.scheduledFor,
      status: scheduledPosts.status,
      errorMessage: scheduledPosts.errorMessage,
      metadata: scheduledPosts.metadata,
      createdAt: scheduledPosts.createdAt,
      updatedAt: scheduledPosts.updatedAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    })
    .from(scheduledPosts)
    .leftJoin(user, eq(scheduledPosts.userId, user.id))
    .orderBy(desc(scheduledPosts.scheduledFor));

  // Convert dates to strings and ensure types match
  const serializedPosts: ScheduledPost[] = posts.map((post) => ({
    ...post,
    scheduledFor: post.scheduledFor.toISOString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    status: post.status as "scheduled" | "posted" | "failed",
    metadata: post.metadata as ScheduledPost["metadata"],
  }));

  return <ScheduledPostsPageClient initialPosts={serializedPosts} />;
}
