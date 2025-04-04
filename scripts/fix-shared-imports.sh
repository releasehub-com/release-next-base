#!/bin/bash

# Fix Header and Footer imports
find ./components -type f -name "*.tsx" -exec sed -i '' \
  -e 's|import Header from "\./Header"|import Header from "@/components/shared/layout/Header"|g' \
  -e 's|import Footer from "\./Footer"|import Footer from "@/components/shared/layout/Footer"|g' \
  -e 's|import UserLogos from "\./UserLogos"|import UserLogos from "@/components/shared/UserLogos"|g' \
  -e 's|"@/components/ui/UserLogos"|"@/components/shared/UserLogos"|g' \
  {} \; 