"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { setVersionInStorage } from "@/config/versions";
import LandingPageWrapper from "@/components/shared/layout/LandingPageWrapper";

const KubernetesLandingPage = dynamic(
  () => import("@/components/landing-pages/kubernetes/KubernetesLandingPage").then((mod) => mod.default),
  { ssr: false },
);

export default function KubernetesManagementPage() {
  useEffect(() => {
    setVersionInStorage("kubernetes");
  }, []);

  return (
    <LandingPageWrapper>
      <KubernetesLandingPage />
    </LandingPageWrapper>
  );
}
