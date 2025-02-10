#!/bin/bash

# Create logos directory if it doesn't exist
mkdir -p public/logos

# Download all logos
curl "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/65e7478b28c49416c60a3e84_Brand-DebtBook-320x80.svg" -o "public/logos/debtbook.svg"
curl "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c066c487c5eeace1b89_Brand-Ethos.svg" -o "public/logos/ethos.svg"
curl "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c0620464b59da2d3fc6_Brand-Navan.svg" -o "public/logos/navan.svg"
curl "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c069d028b16c1837425_Brand-Chipper.svg" -o "public/logos/chipper.svg"
curl "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c04d4b1a7b780ee98e1_Brand-dispatch_health.svg" -o "public/logos/dispatch-health.svg"
curl "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c0485d1049635456984_Brand-Simon.svg" -o "public/logos/simon.svg"
curl "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c03b7222b7bd919a8ae_Brand-Together.svg" -o "public/logos/together.svg"
curl "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c03f440994e9112f8ef_Brand-Datasaur-ai.svg" -o "public/logos/datasaur.svg"
curl "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/6408b779e05890f7fcf8f0c3_Brand-launch-darkly-280x70.svg" -o "public/logos/launch-darkly.svg"
curl "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/6408b77931ea2bc3a4c2df13_Brand-simplyInsured-280x70.svg" -o "public/logos/simply-insured.svg"
curl "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c00455f57d0b226d6da_Brand-softledger.svg" -o "public/logos/softledger.svg"
curl "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/65415c419ce5e4e8883ad42a_logo-cross.svg" -o "public/logos/cross.svg"
curl "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c0065310461ef8198b0_Brand-Noteable.svg" -o "public/logos/noteable.svg"
curl "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c00d4b1a7b780ee87d8_Brand-Mosaic.svg" -o "public/logos/mosaic.svg"

# Move existing logos
mv public/logo-cortex.svg public/logos/cortex.svg
mv public/drata-wordmark-transparent.svg public/logos/drata.svg

echo "All logos have been downloaded and moved to public/logos/" 