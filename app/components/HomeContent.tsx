"use client";

import dynamic from "next/dynamic";
import LandingPageWrapper from "@/components/shared/layout/LandingPageWrapper";

const EphemeralContent = dynamic(
  () =>
    import(
      "@/app/ephemeral-environments-platform/components/EphemeralContent"
    ).then((mod) => mod.default),
  { ssr: false },
);

export default function HomeContent() {
  return (
    <LandingPageWrapper>
      <EphemeralContent />
    </LandingPageWrapper>
  );
}
