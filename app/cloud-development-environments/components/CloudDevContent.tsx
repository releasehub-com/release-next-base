"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CloudDevLanding from "./CloudDevLanding";
import { useVersion } from "@/lib/version/VersionContext";

export default function CloudDevContent() {
  const { setVersion } = useVersion();
  const searchParams = useSearchParams();
  const urlVersion = searchParams.get("version");

  useEffect(() => {
    // If no version in URL, set to cloud-dev
    if (!urlVersion) {
      setVersion("cloud-dev");
    }
  }, [urlVersion, setVersion]);

  return <CloudDevLanding />;
}
