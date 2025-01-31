"use client";

import dynamic from "next/dynamic";

const EphemeralLanding = dynamic(
  () => import("@/components/EphemeralLanding").then((mod) => mod.default),
  { ssr: false },
);

export default function EphemeralEnvironmentsPlatformPage() {
  return <EphemeralLanding />;
}
