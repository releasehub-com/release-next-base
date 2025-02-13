"use client";

import dynamic from "next/dynamic";

const GitLabLandingPage = dynamic(
  () => import("@/components/landing-pages/gitlab/GitLabLandingPage"),
  { ssr: false },
);

export default function GitLabPage() {
  return <GitLabLandingPage />;
}
