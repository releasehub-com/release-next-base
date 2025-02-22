import { db } from '@/lib/db';
import { scheduledPosts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function updatePost() {
  try {
    await db
      .update(scheduledPosts)
      .set({
        status: 'scheduled',
        errorMessage: null,
        updatedAt: new Date()
      })
      .where(eq(scheduledPosts.id, '6883ee67-217b-420f-b751-82f032ff9f99'));
    
    console.log('Post updated successfully');
  } catch (error) {
    console.error('Error updating post:', error);
  }
}

updatePost(); 