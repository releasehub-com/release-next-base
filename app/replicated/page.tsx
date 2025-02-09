"use client";

import dynamic from "next/dynamic";
import LandingPageWrapper from "@/components/LandingPageWrapper";

const ReleaseVsReplicated = dynamic(
  () => import("@/components/ReplicatedLandingPage"),
  { ssr: false },
);

export default function ReplicatedPage() {
  return (
    <LandingPageWrapper>
      <ReleaseVsReplicated />
    </LandingPageWrapper>
  );
}
