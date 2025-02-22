import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { user, socialAccounts } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

async function registerImageUpload(accessToken: string, providerAccountId: string): Promise<{ uploadUrl: string; asset: string }> {
  // First, register the upload
  const registerResponse = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
        owner: `urn:li:member:${providerAccountId}`,
        serviceRelationships: [
          {
            relationshipType: 'OWNER',
            identifier: 'urn:li:userGeneratedContent'
          }
        ]
      }
    }),
  });

  if (!registerResponse.ok) {
    const error = await registerResponse.text();
    throw new Error(`LinkedIn API error: ${error}`);
  }

  const registerData = await registerResponse.json();
  return {
    uploadUrl: registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl,
    asset: registerData.value.asset
  };
}

async function uploadImage(uploadUrl: string, imageData: Buffer): Promise<void> {
  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    body: imageData,
  });

  if (!uploadResponse.ok) {
    const error = await uploadResponse.text();
    throw new Error(`LinkedIn image upload error: ${error}`);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user's ID and LinkedIn account from the database
    const userResult = await db
      .select()
      .from(user)
      .where(eq(user.email, session.user.email));

    if (!userResult.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult[0].id;

    // Get the user's LinkedIn account
    const accountResult = await db
      .select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.userId, userId),
          eq(socialAccounts.provider, 'linkedin')
        )
      );

    if (!accountResult.length) {
      return NextResponse.json(
        { error: 'No LinkedIn account connected' },
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

    // Register upload with LinkedIn
    const { uploadUrl, asset } = await registerImageUpload(accountResult[0].accessToken, accountResult[0].providerAccountId);

    // Upload the image
    await uploadImage(uploadUrl, buffer);

    return NextResponse.json({ 
      asset,
      displayUrl
    });
  } catch (error) {
    console.error('Error uploading image to LinkedIn:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload image' },
      { status: 500 }
    );
  }
} 