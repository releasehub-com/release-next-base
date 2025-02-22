import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { user, socialAccounts } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import sharp from 'sharp';

// Create OAuth 1.0a instance
const oauth = new OAuth({
  consumer: {
    key: process.env.TWITTER_API_KEY!,
    secret: process.env.TWITTER_API_SECRET!
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto
      .createHmac('sha1', key)
      .update(base_string)
      .digest('base64');
  },
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

async function resizeImageIfNeeded(buffer: Buffer, mimeType: string): Promise<Buffer> {
  // If the image is already under the size limit, return it as is
  if (buffer.length <= MAX_FILE_SIZE) {
    return buffer;
  }

  let quality = 80; // Start with 80% quality
  let resizedBuffer = await sharp(buffer)
    .jpeg({ quality })
    .toBuffer();

  // If still too large, reduce quality and dimensions until it fits
  while (resizedBuffer.length > MAX_FILE_SIZE && quality > 10) {
    quality -= 10;
    resizedBuffer = await sharp(buffer)
      .resize(2000, 2000, { // Limit max dimensions
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality })
      .toBuffer();
  }

  return resizedBuffer;
}

async function uploadImageToTwitter(file: File, token: { key: string, secret: string }): Promise<{ media_id: string, media_key: string }> {
  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Resize image if needed
  const resizedBuffer = await resizeImageIfNeeded(buffer, file.type);
  const base64 = resizedBuffer.toString('base64');
  const total_bytes = resizedBuffer.length;

  if (total_bytes > MAX_FILE_SIZE) {
    throw new Error(`Image is too large (${total_bytes} bytes) even after compression. Maximum size is ${MAX_FILE_SIZE} bytes.`);
  }

  const baseUrl = 'https://upload.twitter.com/1.1/media/upload.json';

  // INIT phase
  const initRequestData = oauth.authorize({
    url: baseUrl,
    method: 'POST',
    data: {
      command: 'INIT',
      total_bytes: total_bytes.toString(),
      media_type: 'image/jpeg', // Always use JPEG for compressed images
      media_category: 'tweet_image'
    }
  }, token);

  const initResponse = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      ...Object.fromEntries(Object.entries(oauth.toHeader(initRequestData))),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      command: 'INIT',
      total_bytes: total_bytes.toString(),
      media_type: 'image/jpeg',
      media_category: 'tweet_image'
    }).toString()
  });

  if (!initResponse.ok) {
    const error = await initResponse.text();
    console.error('Twitter INIT response:', error);
    throw new Error(`Twitter media upload INIT error: ${error}`);
  }

  const initData = await initResponse.json();
  const mediaId = initData.media_id_string;

  // APPEND phase
  const appendRequestData = oauth.authorize({
    url: baseUrl,
    method: 'POST',
    data: {
      command: 'APPEND',
      media_id: mediaId,
      media_data: base64,
      segment_index: '0'
    }
  }, token);

  const appendResponse = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      ...Object.fromEntries(Object.entries(oauth.toHeader(appendRequestData))),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      command: 'APPEND',
      media_id: mediaId,
      media_data: base64,
      segment_index: '0'
    }).toString()
  });

  if (!appendResponse.ok) {
    const error = await appendResponse.text();
    console.error('Twitter APPEND response:', error);
    throw new Error(`Twitter media upload APPEND error: ${error}`);
  }

  // FINALIZE phase
  const finalizeRequestData = oauth.authorize({
    url: baseUrl,
    method: 'POST',
    data: {
      command: 'FINALIZE',
      media_id: mediaId
    }
  }, token);

  const finalizeResponse = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      ...Object.fromEntries(Object.entries(oauth.toHeader(finalizeRequestData))),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      command: 'FINALIZE',
      media_id: mediaId
    }).toString()
  });

  if (!finalizeResponse.ok) {
    const error = await finalizeResponse.text();
    console.error('Twitter FINALIZE response:', error);
    throw new Error(`Twitter media upload FINALIZE error: ${error}`);
  }

  const finalizeData = await finalizeResponse.json();
  console.log('Twitter upload response:', finalizeData);

  // Check processing status
  if (finalizeData.processing_info) {
    let processingData = finalizeData.processing_info;
    while (processingData.state === 'pending' || processingData.state === 'in_progress') {
      // Wait for the specified check_after_secs
      await new Promise(resolve => setTimeout(resolve, (processingData.check_after_secs || 1) * 1000));

      // Check status
      const statusUrl = `${baseUrl}?command=STATUS&media_id=${mediaId}`;
      const statusRequestData = oauth.authorize({
        url: statusUrl,
        method: 'GET',
        data: {
          command: 'STATUS',
          media_id: mediaId
        }
      }, token);

      const statusResponse = await fetch(statusUrl, {
        headers: Object.fromEntries(Object.entries(oauth.toHeader(statusRequestData)))
      });

      if (!statusResponse.ok) {
        const error = await statusResponse.text();
        console.error('Twitter STATUS response:', error);
        throw new Error(`Twitter media upload STATUS error: ${error}`);
      }

      const statusData = await statusResponse.json();
      processingData = statusData.processing_info;

      if (processingData.state === 'failed') {
        throw new Error(`Media processing failed: ${processingData.error.message}`);
      }
    }
  }

  return { 
    media_id: mediaId,
    media_key: finalizeData.media_key
  };
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

    // Create object URL for preview
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = file.type;
    const displayUrl = `data:${mimeType};base64,${base64}`;

    // Get OAuth tokens from the account
    const token = {
      key: accountResult[0].accessToken,
      secret: accountResult[0].metadata?.tokenSecret || ''
    };

    if (!token.secret) {
      return NextResponse.json(
        { error: 'Twitter OAuth token secret not found' },
        { status: 400 }
      );
    }

    // Upload image to Twitter
    const { media_id } = await uploadImageToTwitter(file, token);

    // Use the base64 data URL for preview
    return NextResponse.json({ 
      asset: media_id,
      displayUrl: displayUrl // Use the base64 data URL we created earlier
    });
  } catch (error) {
    console.error('Error uploading image to Twitter:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload image' },
      { status: 500 }
    );
  }
} 