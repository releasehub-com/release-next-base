-- Create NextAuth tables if they don't exist
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

-- Copy data from accounts to account if the old table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'accounts') THEN
        INSERT INTO "account" (
            "user_id",
            "type",
            "provider",
            "provider_account_id",
            "refresh_token",
            "access_token",
            "expires_at",
            "token_type",
            "scope",
            "id_token",
            "session_state"
        )
        SELECT 
            "user_id",
            "type",
            "provider",
            "provider_account_id",
            "refresh_token",
            "access_token",
            "expires_at",
            "token_type",
            "scope",
            "id_token",
            "session_state"
        FROM "accounts"
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

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

-- Only drop the old table if the data was successfully copied
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'accounts'
    ) AND EXISTS (
        SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'account'
    ) THEN
        DROP TABLE "accounts";
    END IF;
END $$; 