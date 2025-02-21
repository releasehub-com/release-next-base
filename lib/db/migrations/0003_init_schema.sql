-- Create users table first since other tables reference it
CREATE TABLE IF NOT EXISTS "users" (
    "id" text NOT NULL PRIMARY KEY,
    "name" text,
    "email" text NOT NULL,
    "email_verified" timestamp,
    "image" text,
    "is_admin" boolean NOT NULL DEFAULT false,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create NextAuth required tables
CREATE TABLE IF NOT EXISTS "account" (
    "user_id" text NOT NULL,
    "type" text NOT NULL,
    "provider" text NOT NULL,
    "provider_account_id" text NOT NULL,
    "refresh_token" text,
    "access_token" text,
    "expires_at" integer,
    "token_type" text,
    "scope" text,
    "id_token" text,
    "session_state" text,
    PRIMARY KEY ("provider", "provider_account_id"),
    CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "sessions" (
    "session_token" text NOT NULL PRIMARY KEY,
    "user_id" text NOT NULL,
    "expires" timestamp NOT NULL,
    CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "verification_tokens" (
    "identifier" text NOT NULL,
    "token" text NOT NULL,
    "expires" timestamp NOT NULL,
    PRIMARY KEY ("identifier", "token")
);

-- Create application-specific tables
CREATE TABLE IF NOT EXISTS "social_accounts" (
    "id" text NOT NULL PRIMARY KEY,
    "user_id" text NOT NULL,
    "provider" text NOT NULL,
    "provider_account_id" text NOT NULL,
    "access_token" text NOT NULL,
    "refresh_token" text,
    "expires_at" timestamp,
    "token_type" text,
    "scope" text,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" jsonb,
    CONSTRAINT "social_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "scheduled_posts" (
    "id" text NOT NULL PRIMARY KEY,
    "user_id" text NOT NULL,
    "social_account_id" text NOT NULL,
    "content" text NOT NULL,
    "scheduled_for" timestamp NOT NULL,
    "status" text NOT NULL DEFAULT 'scheduled',
    "error_message" text,
    "metadata" jsonb,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "scheduled_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "scheduled_posts_social_account_id_fkey" FOREIGN KEY ("social_account_id") REFERENCES "social_accounts"("id") ON DELETE CASCADE
); 