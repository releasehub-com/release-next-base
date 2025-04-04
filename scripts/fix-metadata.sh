#!/bin/bash

# Find all metadata.ts files, excluding blog directory
find app -name "metadata.ts" -type f | grep -v "/blog/" | while read -r file; do
  # Get the route path from the file path
  route=$(echo "$file" | sed 's/app\///' | sed 's/\/metadata\.ts//')

  echo "Processing $file..."

  # Replace full URLs with relative paths
  sed -i '' "s|https://release.com/$route|/$route|g" "$file"
  sed -i '' "s|https://release.com/og/|/og/|g" "$file"
  sed -i '' "s|https://release.com/images/|/images/|g" "$file"

  # Replace import { Metadata } with import type { Metadata }
  sed -i '' 's/import { Metadata }/import type { Metadata }/' "$file"

  # Only replace alt text if using the default OG image
  sed -i '' '/url: ".*og-image.png"/,/alt:/ s/alt: "[^"]*"/alt: "Release - The Ephemeral Environments Platform"/' "$file"

  # Add siteName if missing
  if ! grep -q "siteName:" "$file"; then
    sed -i '' '/type: ".*",/a\'$'\n    siteName: "Release",' "$file"
  fi

  # Add creator if missing
  if ! grep -q "creator:" "$file"; then
    sed -i '' '/card: "summary_large_image",/a\'$'\n    creator: "@release_hub",' "$file"
  fi

  echo "Done processing $file"
done 