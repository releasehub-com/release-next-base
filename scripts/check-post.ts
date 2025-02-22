import { db } from '@/lib/db';
import { scheduledPosts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function checkPost() {
  try {
    const post = await db
      .select()
      .from(scheduledPosts)
      .where(eq(scheduledPosts.id, '4825cc10-4e37-4710-99e3-1bbb12927050'));
    
    console.log('Post details:', JSON.stringify(post[0], null, 2));
  } catch (error) {
    console.error('Error checking post:', error);
  }
}

checkPost(); 