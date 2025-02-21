import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Check for required environment variables
if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is required');
}

// Create postgres client
const client = postgres(process.env.POSTGRES_URL);

async function main() {
  try {
    // Check if scheduled_posts table exists
    const result = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'scheduled_posts'
      );
    `;
    
    if (result[0].exists) {
      console.log('✓ scheduled_posts table exists');
      
      // Get table structure
      const columns = await client`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'scheduled_posts'
        ORDER BY ordinal_position;
      `;
      
      console.log('\nTable structure:');
      columns.forEach((col) => {
        console.log(`${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
      });
    } else {
      console.error('✗ scheduled_posts table does not exist');
    }

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('Error checking schema:', error);
    await client.end();
    process.exit(1);
  }
}

main(); 