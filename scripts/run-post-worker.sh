#!/bin/bash
set -e

# Debug mode flag
DEBUG=0
LOCAL=0

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --debug) DEBUG=1; shift ;;
    -l|--local) LOCAL=1; shift ;;
    *) PASSTHROUGH_ARGS="$PASSTHROUGH_ARGS $1"; shift ;;
  esac
done

# Source environment variables only in local mode
if [ "$LOCAL" -eq 1 ]; then
  if [ -f .env.local ]; then
    set -a  # Automatically export all variables
    source .env.local
    set +a  # Stop automatically exporting
  else
    echo "Warning: .env.local not found but --local flag was set"
  fi
fi

if [ "$DEBUG" -eq 1 ]; then
  echo "🔍 Debug mode enabled"
  echo "📂 Current directory: $(pwd)"
  echo "🔑 Checking environment variables:"
  echo "  - POST_WORKER_API_KEY exists: $([ ! -z "$POST_WORKER_API_KEY" ] && echo "✅" || echo "❌")"
  echo "  - TWITTER_CLIENT_ID exists: $([ ! -z "$TWITTER_CLIENT_ID" ] && echo "✅" || echo "❌")"
  echo "  - TWITTER_CLIENT_SECRET exists: $([ ! -z "$TWITTER_CLIENT_SECRET" ] && echo "✅" || echo "❌")"
  echo "  - POSTGRES_URL exists: $([ ! -z "$POSTGRES_URL" ] && echo "✅" || echo "❌")"
  echo "  - SLACK_WEBHOOK_URL exists: $([ ! -z "$SLACK_WEBHOOK_URL" ] && echo "✅" || echo "❌")"
  echo "  - POSTGRES_URL value: $POSTGRES_URL"
  PASSTHROUGH_ARGS="$PASSTHROUGH_ARGS --verbose"
fi

# Run the post worker
echo "Running post worker..."
export POSTGRES_URL
export POST_WORKER_API_KEY
export TWITTER_CLIENT_ID
export TWITTER_CLIENT_SECRET
export SLACK_WEBHOOK_URL
pnpm post-worker $PASSTHROUGH_ARGS

# Check the exit status
EXIT_CODE=$?
if [ "$DEBUG" -eq 1 ]; then
  echo "📝 Post worker exited with code: $EXIT_CODE"
fi

exit $EXIT_CODE 