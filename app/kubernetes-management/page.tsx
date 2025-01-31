"use client";

import dynamic from "next/dynamic";

const KubernetesLandingPage = dynamic(
  () => import("@/components/KubernetesLandingPage"),
  { ssr: false },
);

export default function KubernetesManagementPage() {
  return <KubernetesLandingPage />;
}
