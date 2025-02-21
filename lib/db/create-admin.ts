import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { user } from './schema';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Check for required environment variables
if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is required');
}

// Get admin email from command line
const adminEmail = process.argv[2];
if (!adminEmail) {
  console.error('Please provide an admin email address');
  process.exit(1);
}

// Create postgres client
const client = postgres(process.env.POSTGRES_URL);

// Create drizzle database instance
const db = drizzle(client);

async function main() {
  try {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, adminEmail));
    
    if (existingUser.length > 0) {
      if (existingUser[0].isAdmin) {
        console.log(`User ${adminEmail} is already an admin`);
        process.exit(0);
      }
      
      // Update existing user to be admin
      await db
        .update(user)
        .set({
          isAdmin: true,
          updatedAt: new Date(),
        })
        .where(eq(user.email, adminEmail));
      
      console.log(`User ${adminEmail} has been updated to admin`);
    } else {
      // Create new admin user
      await db
        .insert(user)
        .values({
          id: uuidv4(),
          email: adminEmail,
          isAdmin: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      console.log(`Admin user created successfully with email: ${adminEmail}`);
    }
    
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('Error managing admin user:', error);
    await client.end();
    process.exit(1);
  }
}

main(); 