"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { setVersionInStorage } from "@/config/versions";

const EphemeralLanding = dynamic(
  () => import("@/components/EphemeralLanding").then((mod) => mod.default),
  { ssr: false },
);

export default function EphemeralEnvironmentsPlatformPage() {
  useEffect(() => {
    setVersionInStorage("ephemeral");
  }, []);

  return <EphemeralLanding />;
}
