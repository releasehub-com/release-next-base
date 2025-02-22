import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Check for required environment variables
if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is required");
}

// Create postgres client for migrations
const sql = postgres(process.env.POSTGRES_URL, { max: 1 });

// Run migrations
async function main() {
  try {
    const db = drizzle(sql);

    console.log("Running migrations...");

    await migrate(db, {
      migrationsFolder: "lib/db/migrations",
    });

    console.log("Migrations completed successfully");
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error("Error running migrations:", error);
    await sql.end();
    process.exit(1);
  }
}

main();
