import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { scheduledPosts, socialAccounts } from '@/lib/db/schema';
import { eq, and, lte } from 'drizzle-orm';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

// Helper function to simulate posting to Twitter
async function mockPostToTwitter(content: string): Promise<void> {
  console.log('MOCK: Would post to Twitter:', content);
}

// Helper function to simulate posting to LinkedIn
async function mockPostToLinkedIn(content: string): Promise<void> {
  console.log('MOCK: Would post to LinkedIn:', content);
}

// Helper function to post to Twitter
async function postToTwitter(content: string, account: typeof socialAccounts.$inferSelect, imageAssets?: (string | { asset: string, displayUrl: string })[]): Promise<void> {
  // Format the request body according to Twitter v2 API
  const requestBody: any = {
    text: content
  };

  // Add media IDs if provided - format according to v2 API spec
  if (imageAssets?.length) {
    requestBody.media = {
      media_ids: imageAssets.map(asset => typeof asset === 'string' ? asset : asset.asset)
    };
  }

  // Log the full request details for debugging
  console.log('Twitter API request:', {
    url: 'https://api.twitter.com/2/tweets',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${account.accessToken}`,
      'Content-Type': 'application/json'
    },
    data: requestBody
  });

  const response = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${account.accessToken}`,
      'Content-Type': 'application/json',
      'x-client-type': 'API'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const error = await response.json();
    console.log('Twitter API response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Twitter API request body:', requestBody);
    throw new Error(`Twitter API error: ${JSON.stringify(error)}`);
  }

  const responseData = await response.json();
  console.log('Twitter post response:', responseData);
}

// Helper function to post to LinkedIn
async function postToLinkedIn(content: string, account: typeof socialAccounts.$inferSelect, imageAssets?: Array<string | { asset: string }>): Promise<void> {
  // If we have image assets, check their status first
  if (imageAssets?.length) {
    // Extract just the URN from the asset object if it's an object
    const assetUrns = imageAssets.map(asset => typeof asset === 'string' ? asset : asset.asset);
    
    // Check status of each image and wait for them to be ready
    for (const urn of assetUrns) {
      let isReady = false;
      let attempts = 0;
      const maxAttempts = 20; // Increased from 10 to 20 attempts
      
      while (!isReady && attempts < maxAttempts) {
        // Extract just the asset ID from the URN (everything after the last colon)
        const assetId = urn.split(':').pop();
        
        const statusResponse = await fetch(`https://api.linkedin.com/v2/assets/${assetId}`, {
          headers: {
            'Authorization': `Bearer ${account.accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
            'LinkedIn-Version': '202304'
          }
        });

        if (!statusResponse.ok) {
          const errorText = await statusResponse.text();
          console.error('LinkedIn asset status check error:', {
            status: statusResponse.status,
            statusText: statusResponse.statusText,
            error: errorText,
            assetUrn: urn,
            assetId
          });
          throw new Error(`Failed to check LinkedIn image status: ${errorText}`);
        }

        const status = await statusResponse.json();
        console.log('LinkedIn asset status:', status);

        if (status.status === 'ALLOWED') {
          isReady = true;
        } else {
          attempts++;
          // Wait longer between attempts (2 seconds instead of 1)
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if (!isReady) {
        throw new Error(`LinkedIn image ${urn} not ready after ${maxAttempts} attempts`);
      }
    }
  }

  const body: any = {
    author: `urn:li:person:${account.providerAccountId}`,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text: content
        },
        shareMediaCategory: imageAssets?.length ? 'IMAGE' : 'NONE'
      }
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
    }
  };

  // Add images if provided and not empty
  if (imageAssets?.length) {
    // Extract just the URN from the asset object if it's an object
    const assetUrns = imageAssets.map(asset => typeof asset === 'string' ? asset : asset.asset);
    
    body.specificContent['com.linkedin.ugc.ShareContent'].media = assetUrns.map(urn => ({
      status: 'READY',
      description: {
        text: 'Image'
      },
      media: urn,
      title: {
        text: 'Image'
      }
    }));
  }

  console.log('LinkedIn post body:', JSON.stringify(body, null, 2));

  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${account.accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': '202304'
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('LinkedIn post error:', error);
    throw new Error(`LinkedIn API error: ${error}`);
  }

  const responseData = await response.json();
  console.log('LinkedIn post response:', responseData);
}

export async function POST(request: Request) {
  try {
    // Get API key and dry-run flag from headers
    const apiKey = request.headers.get('x-api-key');
    const isDryRun = request.headers.get('x-dry-run') === '1';

    if (apiKey !== process.env.POST_WORKER_API_KEY && !isDryRun) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find posts that are scheduled and due
    const now = new Date();
    console.log('Current time:', now.toISOString());
    console.log('Current time (PST):', now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));

    const duePosts = await db
      .select({
        post: scheduledPosts,
        account: socialAccounts
      })
      .from(scheduledPosts)
      .leftJoin(socialAccounts, eq(scheduledPosts.socialAccountId, socialAccounts.id))
      .where(
        and(
          eq(scheduledPosts.status, 'scheduled'),
          lte(scheduledPosts.scheduledFor, now)
        )
      );

    console.log('Found posts:', duePosts.length);
    if (duePosts.length > 0) {
      console.log('Posts and their scheduled times:');
      duePosts.forEach(({ post }) => {
        console.log(`- Post ${post.id} scheduled for:`, new Date(post.scheduledFor).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
      });
    }
    console.log('Posts:', JSON.stringify(duePosts, null, 2));

    const results = [];

    // Process each due post
    for (const { post, account } of duePosts) {
      try {
        if (!account) {
          throw new Error('Social account not found');
        }

        // Post to appropriate platform
        if (isDryRun) {
          // Simulate posting in dry-run mode
          if (account.provider === 'twitter') {
            await mockPostToTwitter(post.content);
          } else if (account.provider === 'linkedin') {
            await mockPostToLinkedIn(post.content);
          }
          
          // In dry-run mode, just add success result without updating database
          results.push({
            id: post.id,
            status: 'success',
            dryRun: true
          });
        } else {
          // Actually post in normal mode
          if (account.provider === 'twitter') {
            // Extract image assets from metadata
            const imageAssets = post.metadata?.imageAssets as string[] | undefined;
            await postToTwitter(post.content, account, imageAssets);
          } else if (account.provider === 'linkedin') {
            // Extract image assets from metadata if present
            const imageAssets = post.metadata?.imageAssets as string[] | undefined;
            await postToLinkedIn(post.content, account, imageAssets);
          }

          // Update post status to posted only after successful posting
          await db
            .update(scheduledPosts)
            .set({
              status: 'posted',
              updatedAt: now
            })
            .where(eq(scheduledPosts.id, post.id));

          results.push({
            id: post.id,
            status: 'success',
            dryRun: false
          });
        }
      } catch (error) {
        console.error(`Error posting ${post.id}:`, error);

        // Only update status to failed when not in dry-run mode
        if (!isDryRun) {
          await db
            .update(scheduledPosts)
            .set({
              status: 'failed',
              errorMessage: error instanceof Error ? error.message : 'Unknown error',
              updatedAt: now
            })
            .where(eq(scheduledPosts.id, post.id));
        }

        results.push({
          id: post.id,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          dryRun: isDryRun
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Worker error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 