#!/bin/bash

# Create investors directory if it doesn't exist
mkdir -p public/investors

# Download investor logos from CDN
curl "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/639cfc6b88734fc360126091_sequoia-light-logo.svg" -o "public/investors/sequoia.svg"
curl "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/63a389363e5c9a9449115e88_y-combinator-light-purple.svg" -o "public/investors/yc.svg"
curl "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/615c6ba119203f6c09335995_logo_crv.svg" -o "public/investors/crv.svg"

# Modify the Sequoia logo to use white fill
sed -i '' 's/fill="#29063E"/fill="white"/g' public/investors/sequoia.svg
sed -i '' 's/fill-opacity="0.5"/fill-opacity="1"/g' public/investors/sequoia.svg

echo "All investor logos have been downloaded to public/investors/" 