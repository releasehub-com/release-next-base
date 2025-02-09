"use client";

import dynamic from "next/dynamic";
import LandingPageWrapper from "@/components/LandingPageWrapper";

const CloudLanding = dynamic(
  () => import("@/components/CloudLanding").then((mod) => mod.default),
  { ssr: false },
);

export default function PlatformAsAServicePage() {
  return (
    <LandingPageWrapper>
      <CloudLanding />
    </LandingPageWrapper>
  );
}
