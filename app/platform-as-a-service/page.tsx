"use client";

import dynamic from "next/dynamic";

const CloudLanding = dynamic(
  () => import("@/components/CloudLanding").then((mod) => mod.default),
  { ssr: false },
);

export default function PaasPage() {
  return <CloudLanding />;
}
