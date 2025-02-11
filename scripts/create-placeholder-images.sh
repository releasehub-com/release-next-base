#!/bin/bash

# Create the directory structure if it doesn't exist
mkdir -p public/images/product/release-delivery

# Change to the target directory
cd public/images/product/release-delivery

# Function to create a placeholder image using convert (from ImageMagick)
create_placeholder() {
    local filename=$1
    local text=$2
    local size=$3
    
    convert -size $size xc:gray30 \
        -gravity center \
        -pointsize 40 \
        -fill white \
        -draw "text 0,0 '$text'" \
        $filename
}

# Create placeholder images
create_placeholder "header.webp" "Release Delivery Hero" "2000x1000"
create_placeholder "feature-1.webp" "Enterprise Ready" "800x600"
create_placeholder "feature-2.webp" "Orchestration" "800x600"
create_placeholder "feature-3.webp" "Customer Delight" "800x600"
create_placeholder "resource-1.webp" "Webinar" "600x400"
create_placeholder "resource-2.webp" "Blog" "600x400"
create_placeholder "resource-3.webp" "Press Release" "600x400"
create_placeholder "customer-1.webp" "Monad" "200x80"
create_placeholder "customer-2.webp" "Datasaur.ai" "200x80"
create_placeholder "customer-3.webp" "Stemma" "200x80"

echo "Placeholder images created!" 