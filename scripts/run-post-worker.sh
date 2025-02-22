#!/bin/bash

# Change to the app directory
cd "$(dirname "$0")/.."

# Load environment variables from .env.local
export $(cat .env.local | grep -v '^#' | xargs)

# Debug mode flag
DEBUG=0

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    -d|--debug) DEBUG=1; shift ;;
    *) echo "Unknown parameter: $1"; exit 1 ;;
  esac
done

if [ "$DEBUG" -eq 1 ]; then
  echo "🔍 Debug mode enabled"
  echo "📂 Current directory: $(pwd)"
  echo "🔑 Checking environment variables:"
  echo "  - POST_WORKER_API_KEY exists: $([ ! -z "$POST_WORKER_API_KEY" ] && echo "✅" || echo "❌")"
  echo "  - TWITTER_CLIENT_ID exists: $([ ! -z "$TWITTER_CLIENT_ID" ] && echo "✅" || echo "❌")"
  echo "  - TWITTER_CLIENT_SECRET exists: $([ ! -z "$TWITTER_CLIENT_SECRET" ] && echo "✅" || echo "❌")"
  
  # Run the post worker in debug mode
  echo "🚀 Running post worker with debug headers..."
  
  # First ensure the dev server is running on port 4001
  echo "📡 Checking if dev server is running..."
  if ! nc -z localhost 4001; then
    echo "❌ Dev server not running on port 4001. Please start it with 'pnpm dev' first."
    exit 1
  fi
  
  echo "🔄 Making request to post worker..."
  # Use a temporary file to store the response
  RESP_FILE=$(mktemp)
  curl -v -X POST -H "x-api-key: $POST_WORKER_API_KEY" \
       -H "x-debug: 1" \
       -H "Content-Type: application/json" \
       http://localhost:4001/api/admin/post-worker 2>&1 | tee "$RESP_FILE"
  
  echo -e "\n📝 Server response body:"
  cat "$RESP_FILE" | grep -v "^[*<>]" | sed 's/^[[:space:]]*//'
  rm "$RESP_FILE"
  
  echo "📝 Check the dev server logs for detailed debug output"
else
  # Run the post worker normally
  pnpm post-worker
fi

# Check the exit status
EXIT_CODE=$?
if [ "$DEBUG" -eq 1 ]; then
  echo "📝 Post worker exited with code: $EXIT_CODE"
fi

exit $EXIT_CODE 