#!/bin/bash
set -e

# Check if --local flag is provided
if [ "$1" == "--local" ]; then
  # Source environment variables from .env.local
  source .env.local
  echo "Loaded environment variables from .env.local"
fi

# Run the migration
psql $POSTGRES_URL -f lib/db/migrations/0002_add_user_timezone.sql 