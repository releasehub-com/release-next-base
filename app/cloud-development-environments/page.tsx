import type { Metadata } from "next";
import { metadata } from "./metadata";
import CloudDevContent from "./components/CloudDevContent";
import VersionPageWrapper from "@/components/shared/layout/VersionPageWrapper";
import { Suspense } from "react";

export { metadata };

export default function CloudDevPage() {
  return (
    <VersionPageWrapper includeLayout={true}>
      <Suspense fallback={<div>Loading...</div>}>
        <CloudDevContent />
      </Suspense>
    </VersionPageWrapper>
  );
}
