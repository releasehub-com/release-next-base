#!/bin/bash
set -e

# Extract database name from POSTGRES_URL
DB_NAME="release_landing"

echo "Ensuring database exists..."
psql -v ON_ERROR_STOP=1 postgres <<-EOSQL
    SELECT 'CREATE DATABASE $DB_NAME' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec
EOSQL

echo "Running database migrations..."
pnpm db:migrate

echo "Migrations completed successfully" 