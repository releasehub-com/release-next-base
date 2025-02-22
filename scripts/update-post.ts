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
      .where(eq(scheduledPosts.id, '4825cc10-4e37-4710-99e3-1bbb12927050'));
    
    console.log('Post updated successfully');
  } catch (error) {
    console.error('Error updating post:', error);
  }
}

updatePost(); 