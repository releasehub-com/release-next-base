#!/bin/bash
set -e

# Source environment variables
source .env.local

# Run the migration
psql $POSTGRES_URL -f lib/db/migrations/0002_add_user_timezone.sql 