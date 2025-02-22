#!/bin/bash

# Change to the app directory
cd "$(dirname "$0")/.."

# Load environment variables from .env.local
export $(cat .env.local | grep -v '^#' | xargs)

# Run the post worker
pnpm post-worker 