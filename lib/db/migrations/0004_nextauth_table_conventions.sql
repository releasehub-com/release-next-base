-- Rename tables to match NextAuth conventions
ALTER TABLE IF EXISTS users RENAME TO "user";
ALTER TABLE IF EXISTS sessions RENAME TO "session";
ALTER TABLE IF EXISTS verification_tokens RENAME TO "verification_token";

-- Update foreign key references in other tables
ALTER TABLE IF EXISTS "account" 
  DROP CONSTRAINT IF EXISTS account_user_id_fkey,
  ADD CONSTRAINT account_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES "user"(id) 
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS "session" 
  DROP CONSTRAINT IF EXISTS sessions_user_id_fkey,
  ADD CONSTRAINT session_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES "user"(id) 
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS "social_accounts" 
  DROP CONSTRAINT IF EXISTS social_accounts_user_id_fkey,
  ADD CONSTRAINT social_accounts_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES "user"(id) 
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS "scheduled_posts" 
  DROP CONSTRAINT IF EXISTS scheduled_posts_user_id_fkey,
  ADD CONSTRAINT scheduled_posts_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES "user"(id) 
    ON DELETE CASCADE; 