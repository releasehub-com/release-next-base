"use client";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import AIPipelineHero from "./AIPipelineHero";
import UserLogos from "./UserLogos";
import AIPipelineFeatures from "./AIPipelineFeatures";
import EphemeralIntegration from "./EphemeralIntegration";
import EphemeralDocumentation from "./EphemeralDocumentation";
import AIPipelineUseCases from "./AIPipelineUseCases";
import AIPipelineCTA from "./AIPipelineCTA";

export default function AIPipelineLanding() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-1">
        <AIPipelineHero />
        <UserLogos headline="Trusted by AI-Powered Development Teams" />
        <AIPipelineFeatures />
        <EphemeralIntegration />
        <EphemeralDocumentation />
        <AIPipelineUseCases />
        <AIPipelineCTA />
      </main>
      <Footer />
    </div>
  );
}
