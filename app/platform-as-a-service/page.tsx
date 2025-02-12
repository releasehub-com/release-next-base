"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { setVersionInStorage } from "@/config/versions";
import LandingPageWrapper from "@/components/LandingPageWrapper";

const CloudLanding = dynamic(
  () => import("@/components/CloudLanding").then((mod) => mod.default),
  { ssr: false },
);

export default function PlatformAsAServicePage() {
  useEffect(() => {
    setVersionInStorage("cloud");
  }, []);

  return (
    <LandingPageWrapper>
      <CloudLanding />
    </LandingPageWrapper>
  );
}
