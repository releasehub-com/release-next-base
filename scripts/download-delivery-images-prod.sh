#!/bin/bash

# Create the directory if it doesn't exist
mkdir -p public/images/product/release-delivery

# Change to the target directory
cd public/images/product/release-delivery

# Remove existing files
rm -f *.png *.webp *.svg *.jpg

echo "Downloading header image..."
curl -o header.svg "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/641dd1051c9aa1668fd8caec_management.svg"

echo "Downloading feature images..."
curl -o feature-1.svg "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/648750d837e65ee4b03ce7a4_ico%2060x60.svg"
curl -o feature-2.svg "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/648750d7cf7d0efb14288808_ico%2060x60.svg"
curl -o feature-3.svg "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/648750d7d4e3545ab84c4e01_ico%2060x60.svg"

echo "Downloading resource images..."
curl -L -o resource-1.svg "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/64230258911c43d6fa4743ba_Reliable%20End-to-End%20%5BUpcoming%5D%20-%20new.svg"
curl -L -o resource-2.svg "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/6422ebb1c3f0d2024d3fd104_Blog%20Image.svg"
curl -L -o resource-3.svg "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/6422ebb1c3f0d2024d3fd104_Blog%20Image.svg"

echo "Downloading customer logos..."
curl -o customer-1.svg "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/6418c000e86090be3efeefd1_lp-companies-monad.svg"
curl -o customer-2.svg "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/6418c000396527537b11962c_lp-companies-datasaur.svg"
curl -o customer-3.svg "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/6418bfff7364f82d41aae558_lp-companies-stemma.svg"

echo "Image download process complete!" 