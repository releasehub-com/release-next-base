#!/bin/bash

# Create new directory structure
mkdir -p components/landing-pages/{ai-pipeline,cloud,cloud-dev,ephemeral,gitlab,kubernetes,replicated}
mkdir -p components/shared/{layout,mdx,ui}

# Move AI Pipeline components
mv components/AIPipeline*.tsx components/landing-pages/ai-pipeline/

# Move Cloud components
mv components/Cloud[A-Z]*.tsx components/landing-pages/cloud/

# Move Cloud Dev components
mv components/CloudDev*.tsx components/landing-pages/cloud-dev/

# Move Ephemeral components
mv components/Ephemeral*.tsx components/landing-pages/ephemeral/

# Move other landing pages
mv components/GitLabLandingPage.tsx components/landing-pages/gitlab/
mv components/KubernetesLandingPage.tsx components/landing-pages/kubernetes/
mv components/ReplicatedLandingPage.tsx components/landing-pages/replicated/

# Move layout components
mv components/{Footer,Header,LandingPageWrapper,LandingWrapper,LegalLayout,RootSEOPageLayout}.tsx components/shared/layout/

# Move MDX components
mv components/shared/ClientMDX.tsx components/shared/mdx/
mv components/shared/MDXContent.tsx components/shared/mdx/

# Move UI components
mv components/{InvestorLogos,UserLogos}.tsx components/shared/ui/

# Move blog components
mv components/BlogPostLayout.tsx components/blog/

# Clean up empty directories
rm -rf components/ui 