"use client";

import React, { useEffect } from "react";
import KubernetesLandingPage from "./KubernetesLandingPage";
import { useVersion } from "@/lib/version/VersionContext";

export default function KubernetesContent() {
  const { setVersion } = useVersion();

  useEffect(() => {
    setVersion("kubernetes");
  }, [setVersion]);

  return <KubernetesLandingPage />;
}
