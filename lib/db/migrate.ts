import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Check for required environment variables
if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is required');
}

// Create postgres client for migrations
const migrationClient = postgres(process.env.POSTGRES_URL);

// Create drizzle database instance
const db = drizzle(migrationClient);

// Run migrations
async function main() {
  try {
    await migrate(db, { migrationsFolder: 'lib/db/migrations' });
    console.log('Migrations completed successfully');
    await migrationClient.end();
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    await migrationClient.end();
    process.exit(1);
  }
}

main(); 