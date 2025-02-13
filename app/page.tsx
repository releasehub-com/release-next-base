"use client";

import dynamic from "next/dynamic";
import LandingPageWrapper from "@/components/shared/layout/LandingPageWrapper";

const LandingPage = dynamic(
  () => import("@/components/landing-pages/default/LandingPage").then((mod) => mod.default),
  { ssr: false },
);

export default function HomePage() {
  return (
    <LandingPageWrapper>
      <LandingPage />
    </LandingPageWrapper>
  );
}
