import type { Metadata } from "next";
import { metadata } from "./metadata";
import ReplicatedContent from "./components/ReplicatedContent";
import VersionPageWrapper from "@/components/shared/layout/VersionPageWrapper";
import { Suspense } from "react";

export { metadata };

export default function ReplicatedPage() {
  return (
    <VersionPageWrapper includeLayout={true}>
      <Suspense fallback={<div>Loading...</div>}>
        <ReplicatedContent />
      </Suspense>
    </VersionPageWrapper>
  );
}
