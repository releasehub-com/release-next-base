"use client";

import dynamic from "next/dynamic";

const GitLabLandingPage = dynamic(
  () => import("@/components/GitLabLandingPage"),
  { ssr: false },
);

export default function GitLabPage() {
  return <GitLabLandingPage />;
}
