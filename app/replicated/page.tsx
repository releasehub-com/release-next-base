"use client";

import dynamic from "next/dynamic";
import LandingPageWrapper from "@/components/LandingPageWrapper";

const ReplicatedLandingPage = dynamic(
  () => import("@/components/ReplicatedLandingPage").then((mod) => mod.default),
  { ssr: false },
);

export default function ReplicatedPage() {
  return (
    <LandingPageWrapper>
      <ReplicatedLandingPage />
    </LandingPageWrapper>
  );
} 