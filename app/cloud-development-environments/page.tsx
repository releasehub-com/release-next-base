"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { setVersionInStorage } from "@/config/versions";
import LandingPageWrapper from "@/components/shared/layout/LandingPageWrapper";

const CloudDevLanding = dynamic(
  () => import("@/components/landing-pages/cloud-dev/CloudDevLanding").then((mod) => mod.default),
  { ssr: false },
);

export default function CloudDevelopmentEnvironmentsPage() {
  useEffect(() => {
    setVersionInStorage("cloud-dev");
  }, []);

  return (
    <LandingPageWrapper>
      <CloudDevLanding />
    </LandingPageWrapper>
  );
}
