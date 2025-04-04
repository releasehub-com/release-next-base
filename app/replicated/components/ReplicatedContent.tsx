"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ReplicatedLandingPage from "./ReplicatedLandingPage";
import { useVersion } from "@/lib/version/VersionContext";

export default function ReplicatedContent() {
  const { setVersion } = useVersion();
  const searchParams = useSearchParams();
  const urlVersion = searchParams.get("version");

  useEffect(() => {
    // If no version in URL, set to replicated
    if (!urlVersion) {
      setVersion("replicated");
    }
  }, [urlVersion, setVersion]);

  return <ReplicatedLandingPage />;
}
