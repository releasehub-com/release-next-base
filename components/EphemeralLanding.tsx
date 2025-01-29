"use client";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import EphemeralHero from "./EphemeralHero";
import EphemeralUsers from "./EphemeralUsers";
import EphemeralFeatures from "./EphemeralFeatures";
import EphemeralIntegration from "./EphemeralIntegration";
import EphemeralDocumentation from "./EphemeralDocumentation";
import EphemeralUseCases from "./EphemeralUseCases";
import EphemeralCTA from "./EphemeralCTA";

export default function EphemeralLanding() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-1">
        <EphemeralHero />
        <EphemeralUsers />
        <EphemeralFeatures />
        <EphemeralIntegration />
        <EphemeralDocumentation />
        <EphemeralUseCases />
        <EphemeralCTA />
      </main>
      <Footer />
    </div>
  );
}
