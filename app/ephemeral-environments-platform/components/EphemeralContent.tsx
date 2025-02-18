"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import EphemeralHero from "./EphemeralHero";
import EphemeralFeatures from "./EphemeralFeatures";
import EphemeralUseCases from "./EphemeralUseCases";
import EphemeralCTA from "./EphemeralCTA";
import EphemeralIntegration from "./EphemeralIntegration";
import EphemeralDocumentation from "./EphemeralDocumentation";
import EphemeralUsers from "./EphemeralUsers";
import { useVersion } from "@/lib/version/VersionContext";

export default function EphemeralContent() {
  const { setVersion } = useVersion();
  const searchParams = useSearchParams();
  const urlVersion = searchParams.get("version");

  useEffect(() => {
    // If no version in URL, set to ephemeral
    if (!urlVersion) {
      setVersion("ephemeral");
    }
  }, [urlVersion, setVersion]);

  return (
    <div
      data-testid="ephemeral-content-wrapper"
      className="flex flex-col min-h-screen bg-gray-900 text-gray-100"
    >
      <main className="flex-1">
        <EphemeralHero />
        <EphemeralUsers />
        <EphemeralFeatures />
        <EphemeralIntegration />
        <EphemeralUseCases />
        <EphemeralDocumentation />
        <EphemeralCTA />
      </main>
    </div>
  );
}
