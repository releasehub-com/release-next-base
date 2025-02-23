#!/bin/bash
set -e

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
  echo "  - POSTGRES_URL exists: $([ ! -z "$POSTGRES_URL" ] && echo "✅" || echo "❌")"
fi

# Run the post worker
echo "Running post worker..."
pnpm post-worker "$@"

# Check the exit status
EXIT_CODE=$?
if [ "$DEBUG" -eq 1 ]; then
  echo "📝 Post worker exited with code: $EXIT_CODE"
fi

exit $EXIT_CODE 