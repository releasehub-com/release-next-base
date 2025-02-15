import type { Metadata } from "next";
import { metadata } from "./metadata";
import EphemeralContent from "./components/EphemeralContent";
import VersionPageWrapper from "@/components/shared/layout/VersionPageWrapper";
import { Suspense } from "react";

export { metadata };

export default function EphemeralEnvironmentsPage() {
  return (
    <VersionPageWrapper includeLayout={true}>
      <Suspense fallback={<div>Loading...</div>}>
        <EphemeralContent />
      </Suspense>
    </VersionPageWrapper>
  );
}
