import type { Metadata } from "next";
import { metadata } from "./metadata";
import GitLabContent from "./components/GitLabContent";
import VersionPageWrapper from "@/components/shared/layout/VersionPageWrapper";
import { Suspense } from "react";

export { metadata };

export default function GitLabPage() {
  return (
    <VersionPageWrapper includeLayout={true}>
      <Suspense fallback={<div>Loading...</div>}>
        <GitLabContent />
      </Suspense>
    </VersionPageWrapper>
  );
}
