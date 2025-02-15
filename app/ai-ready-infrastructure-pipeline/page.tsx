import type { Metadata } from "next";
import { metadata } from "./metadata";
import AIPipelineContent from "./components/AIPipelineContent";
import VersionPageWrapper from "@/components/shared/layout/VersionPageWrapper";
import { Suspense } from "react";

export { metadata };

export default function AIPipelinePage() {
  return (
    <VersionPageWrapper includeLayout={true}>
      <Suspense fallback={<div>Loading...</div>}>
        <AIPipelineContent />
      </Suspense>
    </VersionPageWrapper>
  );
}
