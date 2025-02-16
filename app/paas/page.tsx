import type { Metadata } from "next";
import { metadata } from "./metadata";
import PaasContent from "../platform-as-a-service/components/PaasContent";
import VersionPageWrapper from "@/components/shared/layout/VersionPageWrapper";
import { Suspense } from "react";

export { metadata };

export default function PaasPage() {
  return (
    <VersionPageWrapper includeLayout={true}>
      <Suspense fallback={<div>Loading...</div>}>
        <PaasContent />
      </Suspense>
    </VersionPageWrapper>
  );
}
