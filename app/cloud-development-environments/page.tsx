"use client";

import dynamic from "next/dynamic";
import LandingPageWrapper from "@/components/LandingPageWrapper";

const CloudDevLanding = dynamic(
  () => import("@/components/CloudDevLanding").then((mod) => mod.default),
  { ssr: false },
);

export default function CloudDevelopmentEnvironmentsPage() {
  return (
    <LandingPageWrapper>
      <CloudDevLanding />
    </LandingPageWrapper>
  );
}
