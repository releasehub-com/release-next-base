"use client";

import React from "react";
import Header from "@/components/shared/layout/Header";
import Footer from "@/components/shared/layout/Footer";
import AIPipelineHero from "./AIPipelineHero";
import UserLogos from "@/components/shared/UserLogos";
import AIPipelineFeatures from "./AIPipelineFeatures";
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
        <AIPipelineUseCases />
        <AIPipelineCTA />
      </main>
      <Footer />
    </div>
  );
}
