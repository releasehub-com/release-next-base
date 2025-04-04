"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import KubernetesLandingPage from "./KubernetesLandingPage";
import { useVersion } from "@/lib/version/VersionContext";

export default function KubernetesContent() {
  const { setVersion } = useVersion();
  const searchParams = useSearchParams();
  const urlVersion = searchParams.get("version");

  useEffect(() => {
    // If no version in URL, set to kubernetes
    if (!urlVersion) {
      setVersion("kubernetes");
    }
  }, [urlVersion, setVersion]);

  return <KubernetesLandingPage />;
}
