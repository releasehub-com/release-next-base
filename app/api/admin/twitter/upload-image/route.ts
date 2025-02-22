import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { user, socialAccounts } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

async function uploadImageToTwitter(imageData: Buffer, accessToken: string): Promise<{ media_id: string }> {
  // Upload to Twitter's Media Library
  const uploadResponse = await fetch('https://api.twitter.com/2/media/library', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      media_category: 'tweet_image',
      media: imageData.toString('base64'),
      mime_type: 'image/jpeg'
    }),
  });

  if (!uploadResponse.ok) {
    const error = await uploadResponse.text();
    console.error('Twitter API response:', error);
    throw new Error(`Twitter media upload error: ${error}`);
  }

  const uploadData = await uploadResponse.json();
  
  if (!uploadData.data?.media_id) {
    throw new Error('No media_id returned from Twitter');
  }

  return { media_id: uploadData.data.media_id };
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user's ID and Twitter account from the database
    const userResult = await db
      .select()
      .from(user)
      .where(eq(user.email, session.user.email));

    if (!userResult.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult[0].id;

    // Get the user's Twitter account
    const accountResult = await db
      .select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.userId, userId),
          eq(socialAccounts.provider, 'twitter')
        )
      );

    if (!accountResult.length) {
      return NextResponse.json(
        { error: 'No Twitter account connected' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create object URL for preview
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = file.type;
    const displayUrl = `data:${mimeType};base64,${base64}`;

    // Upload image to Twitter
    const { media_id } = await uploadImageToTwitter(buffer, accountResult[0].accessToken);

    return NextResponse.json({ 
      asset: media_id,
      displayUrl
    });
  } catch (error) {
    console.error('Error uploading image to Twitter:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload image' },
      { status: 500 }
    );
  }
} 