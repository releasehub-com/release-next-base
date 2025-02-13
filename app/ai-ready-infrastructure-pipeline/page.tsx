"use client";

import { useEffect } from "react";
import AIPipelineLanding from "@/components/landing-pages/ai-pipeline/AIPipelineLanding";
import { setVersionInStorage } from "@/config/versions";

export default function AIPipelinePage() {
  useEffect(() => {
    setVersionInStorage("ai-pipeline");
  }, []);

  return <AIPipelineLanding />;
}
