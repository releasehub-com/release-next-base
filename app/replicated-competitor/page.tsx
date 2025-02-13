"use client";

import dynamic from "next/dynamic";

const ReplicatedLandingPage = dynamic(
  () => import("@/components/landing-pages/replicated/ReplicatedLandingPage"),
  { ssr: false },
);

export default function ReplicatedCompetitorPage() {
  return <ReplicatedLandingPage />;
}
