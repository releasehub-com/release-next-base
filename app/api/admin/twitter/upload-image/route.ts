import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { user, socialAccounts } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import sharp from 'sharp';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

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

async function uploadImageToTwitter(file: File, accessToken: string, tokenSecret: string): Promise<{ media_id: string }> {
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

  // Create OAuth 1.0a instance
  const oauth = new OAuth({
    consumer: {
      key: process.env.TWITTER_API_KEY!,
      secret: process.env.TWITTER_API_SECRET!
    },
    signature_method: 'HMAC-SHA1',
    hash_function(baseString: string, key: string) {
      return crypto.createHmac('sha1', key).update(baseString).digest('base64');
    }
  });

  // Use the app's OAuth 1.0a tokens
  const token = {
    key: accessToken,
    secret: tokenSecret
  };

  // Log the request details for debugging
  console.log('OAuth credentials:', {
    consumerKey: process.env.TWITTER_API_KEY,
    hasConsumerSecret: !!process.env.TWITTER_API_SECRET,
    hasAccessToken: !!accessToken,
    hasAccessTokenSecret: !!tokenSecret
  });

  const baseUrl = 'https://upload.twitter.com/1.1/media/upload.json';

  // INIT phase
  const initRequestData = {
    url: baseUrl,
    method: 'POST',
    data: {
      command: 'INIT',
      total_bytes: total_bytes.toString(),
      media_type: 'image/jpeg',
      media_category: 'tweet_image'
    }
  };

  const initResponse = await fetch(initRequestData.url, {
    method: initRequestData.method,
    headers: {
      ...oauth.toHeader(oauth.authorize(initRequestData, token)),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(initRequestData.data).toString()
  });

  if (!initResponse.ok) {
    const error = await initResponse.text();
    console.error('Twitter INIT response:', error);
    throw new Error(`Twitter media upload INIT error: ${error}`);
  }

  const initData = await initResponse.json();
  const mediaId = initData.media_id_string;

  // APPEND phase
  const appendRequestData = {
    url: baseUrl,
    method: 'POST',
    data: {
      command: 'APPEND',
      media_id: mediaId,
      segment_index: '0',
      media_data: base64
    }
  };

  const appendResponse = await fetch(appendRequestData.url, {
    method: appendRequestData.method,
    headers: {
      ...oauth.toHeader(oauth.authorize(appendRequestData, token)),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(appendRequestData.data).toString()
  });

  if (!appendResponse.ok) {
    const error = await appendResponse.text();
    console.error('Twitter APPEND response:', error);
    throw new Error(`Twitter media upload APPEND error: ${error}`);
  }

  // FINALIZE phase
  const finalizeRequestData = {
    url: baseUrl,
    method: 'POST',
    data: {
      command: 'FINALIZE',
      media_id: mediaId
    }
  };

  const finalizeResponse = await fetch(finalizeRequestData.url, {
    method: finalizeRequestData.method,
    headers: {
      ...oauth.toHeader(oauth.authorize(finalizeRequestData, token)),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(finalizeRequestData.data).toString()
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
      const statusRequestData = {
        url: baseUrl,
        method: 'GET',
        data: {
          command: 'STATUS',
          media_id: mediaId
        }
      };

      const statusResponse = await fetch(`${statusRequestData.url}?${new URLSearchParams(statusRequestData.data).toString()}`, {
        headers: {
          ...oauth.toHeader(oauth.authorize(statusRequestData, token))
        }
      });

      if (!statusResponse.ok) {
        const error = await statusResponse.text();
        console.error('Twitter STATUS response:', error);
        throw new Error(`Twitter media upload STATUS error: ${error}`);
      }

      const statusData = await statusResponse.json();
      processingData = statusData.processing_info;

      if (processingData.state === 'failed') {
        throw new Error(`Media processing failed: ${processingData.error?.message || 'Unknown error'}`);
      }
    }
  }

  return { media_id: mediaId };
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

    // Get OAuth 1.0a credentials from the account metadata
    const oauth1Creds = accountResult[0].metadata?.oauth1;
    if (!oauth1Creds?.accessToken || !oauth1Creds?.tokenSecret) {
      return NextResponse.json(
        { error: 'Twitter OAuth 1.0a credentials not found. Please connect your account with OAuth 1.0a.' },
        { status: 400 }
      );
    }

    // Create object URL for preview
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = file.type;
    const displayUrl = `data:${mimeType};base64,${base64}`;

    // Upload image to Twitter using OAuth 1.0a credentials
    const { media_id } = await uploadImageToTwitter(file, oauth1Creds.accessToken, oauth1Creds.tokenSecret);

    // Use the base64 data URL for preview
    return NextResponse.json({ 
      asset: media_id,
      displayUrl: displayUrl
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 