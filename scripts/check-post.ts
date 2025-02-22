import { db } from '@/lib/db';
import { scheduledPosts, socialAccounts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function checkPost() {
  try {
    const post = await db
      .select()
      .from(scheduledPosts)
      .where(eq(scheduledPosts.id, '663a2463-51da-45a4-b474-2cf00baa2b7f'));
    
    console.log('Post details:', JSON.stringify(post[0], null, 2));

    if (post[0]) {
      const account = await db
        .select()
        .from(socialAccounts)
        .where(eq(socialAccounts.id, post[0].socialAccountId));
      
      console.log('\nLinked social account:', JSON.stringify(account[0], null, 2));
    }
  } catch (error) {
    console.error('Error checking post:', error);
  }
}

checkPost(); 