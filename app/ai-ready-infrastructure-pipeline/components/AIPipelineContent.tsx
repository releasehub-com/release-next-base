"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AIPipelineHero from "./AIPipelineHero";
import AIPipelineFeatures from "./AIPipelineFeatures";
import AIPipelineUseCases from "./AIPipelineUseCases";
import AIPipelineCTA from "./AIPipelineCTA";
import { useVersion } from "@/lib/version/VersionContext";

export default function AIPipelineContent() {
  const { setVersion } = useVersion();
  const searchParams = useSearchParams();
  const urlVersion = searchParams.get("version");

  useEffect(() => {
    // If no version in URL, set to ai-pipeline
    if (!urlVersion) {
      setVersion("ai-pipeline");
    }
  }, [urlVersion, setVersion]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-1">
        <AIPipelineHero />
        <AIPipelineFeatures />
        <AIPipelineUseCases />
        <AIPipelineCTA />
      </main>
    </div>
  );
}
