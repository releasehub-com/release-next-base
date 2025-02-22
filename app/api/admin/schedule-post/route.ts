import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { user, scheduledPosts, socialAccounts } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
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

    const body = await request.json();
    const { content, scheduledFor, socialAccountId, metadata } = body;

    if (!content || !scheduledFor || !socialAccountId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate that the scheduled time is in the future
    const scheduledTime = new Date(scheduledFor);
    if (scheduledTime <= new Date()) {
      return NextResponse.json(
        { error: 'Scheduled time must be in the future' },
        { status: 400 }
      );
    }

    // Validate image assets if present
    if (metadata?.imageAssets) {
      if (!Array.isArray(metadata.imageAssets)) {
        return NextResponse.json(
          { error: 'imageAssets must be an array' },
          { status: 400 }
        );
      }

      console.log('Received image assets:', metadata.imageAssets);

      if (metadata.imageAssets.length > 9) {
        return NextResponse.json(
          { error: 'Maximum of 9 images allowed' },
          { status: 400 }
        );
      }

      // Get the user's LinkedIn account
      const linkedInAccount = await db
        .select()
        .from(socialAccounts)
        .where(
          and(
            eq(socialAccounts.userId, userId),
            eq(socialAccounts.provider, 'linkedin')
          )
        )
        .limit(1);

      if (!linkedInAccount.length) {
        return NextResponse.json(
          { error: 'LinkedIn account not found' },
          { status: 404 }
        );
      }

      // Fetch display URLs for each asset
      const imageAssets = await Promise.all(
        metadata.imageAssets.map(async (asset) => {
          try {
            // Extract the asset ID from the URN
            const assetId = asset.split(':').pop();
            const response = await fetch(`https://api.linkedin.com/v2/assets/${assetId}`, {
              headers: {
                'Authorization': `Bearer ${linkedInAccount[0].accessToken}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0',
                'LinkedIn-Version': '202304'
              },
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error('LinkedIn asset details error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText,
                asset,
                assetId
              });
              throw new Error(`Failed to fetch asset details: ${errorText}`);
            }

            const data = await response.json();
            console.log('LinkedIn asset details response:', data);

            // Only check the overall asset status
            if (data.status !== 'ALLOWED') {
              console.error('Asset not ready:', data);
              throw new Error('Asset not ready for use');
            }

            // We don't need the display URL for LinkedIn posts
            return {
              asset,
              status: data.status
            };
          } catch (error) {
            console.error('Error fetching asset details:', error);
            return { asset, status: null };
          }
        })
      );

      metadata.imageAssets = imageAssets;
    }

    // Create scheduled post
    const [scheduledPost] = await db
      .insert(scheduledPosts)
      .values({
        id: uuidv4(),
        userId,
        socialAccountId,
        content,
        scheduledFor: scheduledTime,
        metadata: {
          ...metadata,
          imageAssets: metadata?.imageAssets || []
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({ scheduledPost });
  } catch (error) {
    console.error('Error scheduling post:', error);
    return NextResponse.json(
      { error: 'Failed to schedule post' },
      { status: 500 }
    );
  }
} 