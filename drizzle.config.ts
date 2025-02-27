import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is required");
}

// @ts-ignore drizzle-kit types are incorrect for postgres driver
export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  driver: "pg",
  dialect: "postgresql",
  dbCredentials: {
    connectionString:
      process.env.POSTGRES_URL ||
      "postgres://postgres:postgres@localhost:5432/release_landing",
  },
};
