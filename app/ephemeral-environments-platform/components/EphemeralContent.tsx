"use client";

import React, { useEffect } from "react";
import Header from "@/components/shared/layout/Header";
import Footer from "@/components/shared/layout/Footer";
import EphemeralHero from "./EphemeralHero";
import EphemeralFeatures from "./EphemeralFeatures";
import EphemeralUseCases from "./EphemeralUseCases";
import EphemeralCTA from "./EphemeralCTA";
import EphemeralIntegration from "./EphemeralIntegration";
import EphemeralDocumentation from "./EphemeralDocumentation";
import { useVersion } from "@/lib/version/VersionContext";

export default function EphemeralContent() {
  const { setVersion } = useVersion();

  useEffect(() => {
    setVersion("ephemeral");
  }, [setVersion]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-1">
        <EphemeralHero />
        <EphemeralFeatures />
        <EphemeralIntegration />
        <EphemeralUseCases />
        <EphemeralDocumentation />
        <EphemeralCTA />
      </main>
      <Footer />
    </div>
  );
}
