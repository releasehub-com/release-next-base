#!/bin/bash

# Create the directory structure if it doesn't exist
mkdir -p public/images/product/release-delivery

# Change to the target directory
cd public/images/product/release-delivery

# Array of image names to download
images=(
    "header.webp"
    "feature-1.webp"
    "feature-2.webp"
    "feature-3.webp"
    "resource-1.webp"
    "resource-2.webp"
    "resource-3.webp"
)

# Base URL for the images
base_url="https://release.com/images/product/release-delivery"

# Download each image
for image in "${images[@]}"; do
    echo "Downloading $image..."
    curl -o "$image" "$base_url/$image"
    if [ $? -eq 0 ]; then
        echo "Successfully downloaded $image"
    else
        echo "Failed to download $image"
    fi
done

echo "Image download process complete!" 