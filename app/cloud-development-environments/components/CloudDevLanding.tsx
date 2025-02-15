"use client";

import React from "react";
import CloudDevHero from "./CloudDevHero";
import CloudDevFeatures from "./CloudDevFeatures";
import CloudDevIntegration from "./CloudDevIntegration";
import CloudDevUseCases from "./CloudDevUseCases";
import CloudDevUsers from "./CloudDevUsers";
import CloudDevCTA from "./CloudDevCTA";
import EphemeralDocumentation from "@/app/platform-as-a-service/components/EphemeralDocumentation";

export default function CloudDevLanding() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-1">
        <CloudDevHero />
        <CloudDevUsers />
        <CloudDevFeatures />
        <CloudDevIntegration />
        <CloudDevUseCases />
        <EphemeralDocumentation />
        <CloudDevCTA />
      </main>
    </div>
  );
}
