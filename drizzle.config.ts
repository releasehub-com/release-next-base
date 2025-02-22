import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is required");
}

export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  breakpoints: true,
  // @ts-ignore
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL,
  } as any,
} satisfies Config;
