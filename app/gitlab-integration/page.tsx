"use client";

import dynamic from "next/dynamic";
import LandingPageWrapper from "@/components/LandingPageWrapper";

const GitLabLandingPage = dynamic(
  () => import("@/components/GitLabLandingPage").then((mod) => mod.default),
  { ssr: false },
);

export default function GitLabIntegrationPage() {
  return (
    <LandingPageWrapper>
      <GitLabLandingPage />
    </LandingPageWrapper>
  );
} 