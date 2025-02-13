"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { setVersionInStorage } from "@/config/versions";
import LandingPageWrapper from "@/components/shared/layout/LandingPageWrapper";

const ReplicatedLandingPage = dynamic(
  () => import("@/components/landing-pages/replicated/ReplicatedLandingPage").then((mod) => mod.default),
  { ssr: false },
);

export default function ReplicatedPage() {
  useEffect(() => {
    setVersionInStorage("replicated");
  }, []);

  return (
    <LandingPageWrapper>
      <ReplicatedLandingPage />
    </LandingPageWrapper>
  );
}
