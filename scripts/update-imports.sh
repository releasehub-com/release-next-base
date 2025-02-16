#!/bin/bash

# Update layout component imports
find . -type f -name "*.tsx" -exec sed -i '' \
  -e 's|"@/components/Header"|"@/components/shared/layout/Header"|g' \
  -e 's|"@/components/Footer"|"@/components/shared/layout/Footer"|g' \
  -e 's|"@/components/LandingPageWrapper"|"@/components/shared/layout/LandingPageWrapper"|g' \
  -e 's|"@/components/LandingWrapper"|"@/components/shared/layout/LandingWrapper"|g' \
  -e 's|"@/components/LegalLayout"|"@/components/shared/layout/LegalLayout"|g' \
  -e 's|"@/components/RootSEOPageLayout"|"@/components/shared/layout/RootSEOPageLayout"|g' \
  {} \;

# Update landing page imports
find . -type f -name "*.tsx" -exec sed -i '' \
  -e 's|"@/components/AIPipeline|"@/components/landing-pages/ai-pipeline/AIPipeline|g' \
  -e 's|"@/components/Cloud[^D]|"@/components/landing-pages/cloud/Cloud|g' \
  -e 's|"@/components/CloudDev|"@/components/landing-pages/cloud-dev/CloudDev|g' \
  -e 's|"@/components/Ephemeral|"@/components/landing-pages/ephemeral/Ephemeral|g' \
  -e 's|"@/components/GitLabLandingPage"|"@/components/landing-pages/gitlab/GitLabLandingPage"|g' \
  -e 's|"@/components/KubernetesLandingPage"|"@/components/landing-pages/kubernetes/KubernetesLandingPage"|g' \
  -e 's|"@/components/ReplicatedLandingPage"|"@/components/landing-pages/replicated/ReplicatedLandingPage"|g' \
  {} \;

# Update UI component imports
find . -type f -name "*.tsx" -exec sed -i '' \
  -e 's|"@/components/InvestorLogos"|"@/components/shared/ui/InvestorLogos"|g' \
  -e 's|"@/components/UserLogos"|"@/components/shared/ui/UserLogos"|g' \
  {} \; 