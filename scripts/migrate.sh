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

# Run the migration
echo "Running migrations..."
psql $POSTGRES_URL -f lib/db/migrations/0002_add_user_timezone.sql 
echo "Migrations completed successfully." 