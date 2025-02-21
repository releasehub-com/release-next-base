import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { user, scheduledPosts, socialAccounts } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user's ID from the database
    const userResult = await db
      .select()
      .from(user)
      .where(eq(user.email, session.user.email));

    if (!userResult.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult[0].id;

    // Get status filter from query params
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    // Build query conditions
    let conditions = [eq(scheduledPosts.userId, userId)];
    if (statusFilter && ['scheduled', 'posted', 'failed'].includes(statusFilter)) {
      conditions.push(eq(scheduledPosts.status, statusFilter as any));
    }

    // Get posts with social account information
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
        socialAccount: socialAccounts
      })
      .from(scheduledPosts)
      .leftJoin(socialAccounts, eq(scheduledPosts.socialAccountId, socialAccounts.id))
      .where(and(...conditions))
      .orderBy(desc(scheduledPosts.scheduledFor));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching scheduled posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheduled posts' },
      { status: 500 }
    );
  }
} 