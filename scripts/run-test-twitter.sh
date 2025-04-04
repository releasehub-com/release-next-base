#!/bin/bash

# Load environment variables from .env.local
set -a
source .env.local
set +a

# Print database connection info (without showing credentials)
echo "Connecting to database at: ${POSTGRES_URL//:*@/:***@}"

# Run the script with the environment variables
echo "Running Twitter API test script..."
pnpm tsx scripts/test-twitter-post.ts "$@" 