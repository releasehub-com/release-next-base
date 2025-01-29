"use client";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import CloudDevHero from "./CloudDevHero";
import CloudDevUsers from "./CloudDevUsers";
import CloudDevFeatures from "./CloudDevFeatures";
import CloudDevIntegration from "./CloudDevIntegration";
import EphemeralDocumentation from "./EphemeralDocumentation";
import CloudDevUseCases from "./CloudDevUseCases";
import CloudDevCTA from "./CloudDevCTA";

export default function CloudDevLanding() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-1">
        <CloudDevHero />
        <CloudDevUsers />
        <CloudDevFeatures />
        <CloudDevIntegration />
        <EphemeralDocumentation />
        <CloudDevUseCases />
        <CloudDevCTA />
      </main>
      <Footer />
    </div>
  );
}
