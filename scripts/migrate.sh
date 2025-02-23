#!/bin/bash
set -e

if [ -z "$POSTGRES_URL" ]; then
    echo "Error: POSTGRES_URL environment variable is required"
    exit 1
fi

# Extract database name from POSTGRES_URL
# Example URL: postgresql://user:pass@host:5432/dbname
DB_NAME=$(echo $POSTGRES_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
DB_HOST=$(echo $POSTGRES_URL | sed -n 's/.*@\([^:]*\).*/\1/p')
DB_PORT=$(echo $POSTGRES_URL | sed -n 's/.*:\([^/]*\)\/.*/\1/p')
DB_USER=$(echo $POSTGRES_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $POSTGRES_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\).*/\1/p')

export PGPASSWORD=$DB_PASS

echo "Ensuring database exists..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME"

echo "Running database migrations..."
pnpm db:migrate

echo "Migrations completed successfully" 