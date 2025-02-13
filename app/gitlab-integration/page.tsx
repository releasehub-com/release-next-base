"use client";

import dynamic from "next/dynamic";
import LandingPageWrapper from "@/components/shared/layout/LandingPageWrapper";

const GitLabLandingPage = dynamic(
  () =>
    import("@/components/landing-pages/gitlab/GitLabLandingPage").then(
      (mod) => mod.default,
    ),
  { ssr: false },
);

export default function GitLabIntegrationPage() {
  return (
    <LandingPageWrapper>
      <GitLabLandingPage />
    </LandingPageWrapper>
  );
}
