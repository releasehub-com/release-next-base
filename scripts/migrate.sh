#!/bin/bash
set -e

# Check if --local flag is provided
if [ "$1" == "--local" ]; then
  # Source environment variables from .env.local
  source .env.local
  echo "Loaded environment variables from .env.local"
fi

# Extract database name from POSTGRES_URL
# Assuming POSTGRES_URL format is: postgres://user:password@host:port/dbname
DB_NAME=$(echo $POSTGRES_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
if [ -z "$DB_NAME" ]; then
  DB_NAME="release_landing"  # Default database name if not found in URL
fi

# Extract connection string without database name
CONNECTION_STRING=$(echo $POSTGRES_URL | sed -n 's/\(.*\/\)[^?]*.*/\1postgres/p')
if [ -z "$CONNECTION_STRING" ]; then
  echo "Error: Could not parse POSTGRES_URL"
  exit 1
fi

echo "Checking if database $DB_NAME exists..."

# Check if database exists and create it if it doesn't
if ! psql $CONNECTION_STRING -c "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1; then
  echo "Database $DB_NAME does not exist. Creating..."
  psql $CONNECTION_STRING -c "CREATE DATABASE $DB_NAME;"
  echo "Database $DB_NAME created successfully."
else
  echo "Database $DB_NAME already exists."
fi

# Run all migrations in order
echo "Running migrations..."

# Check if the user table exists
if ! psql $POSTGRES_URL -c "SELECT to_regclass('public.user');" | grep -q user; then
  echo "Initial schema does not exist. Running initial migration..."
  psql $POSTGRES_URL -f lib/db/migrations/0000_polite_pete_wisdom.sql
  echo "Initial schema created successfully."
fi

# Check if the socialAccountId column is nullable
NULLABLE_CHECK=$(psql $POSTGRES_URL -t -c "SELECT is_nullable FROM information_schema.columns WHERE table_name = 'scheduled_posts' AND column_name = 'socialAccountId';")
if [[ $NULLABLE_CHECK == *"NO"* ]]; then
  echo "Running migration 0001: Make socialAccountId nullable..."
  psql $POSTGRES_URL -f lib/db/migrations/0001_nullable_social_account.sql
  echo "Migration 0001 completed successfully."
fi

# Check if the timezone column exists in the user table
if ! psql $POSTGRES_URL -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'timezone';" | grep -q timezone; then
  echo "Running migration 0002: Add user timezone..."
  psql $POSTGRES_URL -f lib/db/migrations/0002_add_user_timezone.sql
  echo "Migration 0002 completed successfully."
fi

echo "All migrations completed successfully." 