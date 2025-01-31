"use client";

import dynamic from "next/dynamic";

const CloudDevLanding = dynamic(
  () => import("@/components/CloudDevLanding").then((mod) => mod.default),
  { ssr: false },
);

export default function CloudDevelopmentEnvironmentsPage() {
  return <CloudDevLanding />;
}
