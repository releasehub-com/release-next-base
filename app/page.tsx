"use client";

import dynamic from "next/dynamic";
import LandingPageWrapper from "@/components/LandingPageWrapper";

const LandingPage = dynamic(
  () => import("@/components/LandingPage").then((mod) => mod.default),
  { ssr: false },
);

export default function HomePage() {
  return (
    <LandingPageWrapper>
      <LandingPage />
    </LandingPageWrapper>
  );
}
