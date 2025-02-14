"use client";

import React, { useEffect } from "react";
import ReplicatedLandingPage from "./ReplicatedLandingPage";
import { useVersion } from "@/lib/version/VersionContext";

export default function ReplicatedContent() {
  const { setVersion } = useVersion();

  useEffect(() => {
    setVersion("replicated");
  }, [setVersion]);

  return <ReplicatedLandingPage />;
}
