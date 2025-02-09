"use client";

import dynamic from "next/dynamic";
import LandingPageWrapper from "@/components/LandingPageWrapper";

const KubernetesLandingPage = dynamic(
  () => import("@/components/KubernetesLandingPage").then((mod) => mod.default),
  { ssr: false },
);

export default function KubernetesManagementPage() {
  return (
    <LandingPageWrapper>
      <KubernetesLandingPage />
    </LandingPageWrapper>
  );
}
