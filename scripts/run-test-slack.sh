#!/bin/bash
set -e

# Debug mode flag
DEBUG=0
LOCAL=0
PASSTHROUGH_ARGS=""

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --debug) DEBUG=1; shift ;;
    -l|--local) LOCAL=1; shift ;;
    --) shift; PASSTHROUGH_ARGS="$PASSTHROUGH_ARGS $*"; break ;;
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
  echo "  - SLACK_WEBHOOK_URL exists: $([ ! -z "$SLACK_WEBHOOK_URL" ] && echo "✅" || echo "❌")"
  echo "  - SLACK_WEBHOOK_URL value: ${SLACK_WEBHOOK_URL:0:15}..."
  echo "📝 Passthrough arguments: $PASSTHROUGH_ARGS"
  PASSTHROUGH_ARGS="$PASSTHROUGH_ARGS --verbose"
fi

# Run the Slack test
echo "Running Slack notification test..."
export SLACK_WEBHOOK_URL
pnpm tsx scripts/test-slack.ts $PASSTHROUGH_ARGS

# Check the exit status
EXIT_CODE=$?
if [ "$DEBUG" -eq 1 ]; then
  echo "📝 Slack test exited with code: $EXIT_CODE"
fi

exit $EXIT_CODE 