import { db } from '@/lib/db';
import { socialAccounts } from '@/lib/db/schema';

async function checkSocialAccounts() {
  try {
    const accounts = await db
      .select()
      .from(socialAccounts);
    
    console.log('Social accounts:', JSON.stringify(accounts, null, 2));
  } catch (error) {
    console.error('Error checking social accounts:', error);
  }
}

checkSocialAccounts(); 