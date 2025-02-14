"use client";

import React, { useEffect } from "react";
import Header from "@/components/shared/layout/Header";
import Footer from "@/components/shared/layout/Footer";
import AIPipelineHero from "./AIPipelineHero";
import AIPipelineFeatures from "./AIPipelineFeatures";
import AIPipelineUseCases from "./AIPipelineUseCases";
import AIPipelineCTA from "./AIPipelineCTA";
import { useVersion } from "@/lib/version/VersionContext";

export default function AIPipelineContent() {
  const { setVersion } = useVersion();

  useEffect(() => {
    setVersion("ai-pipeline");
  }, [setVersion]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-1">
        <AIPipelineHero />
        <AIPipelineFeatures />
        <AIPipelineUseCases />
        <AIPipelineCTA />
      </main>
      <Footer />
    </div>
  );
}
