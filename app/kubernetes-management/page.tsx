import type { Metadata } from "next";
import { metadata } from "./metadata";
import KubernetesContent from "./components/KubernetesContent";
import VersionPageWrapper from "@/components/shared/layout/VersionPageWrapper";
import { Suspense } from "react";

export { metadata };

export default function KubernetesPage() {
  return (
    <VersionPageWrapper includeLayout={true}>
      <Suspense fallback={<div>Loading...</div>}>
        <KubernetesContent />
      </Suspense>
    </VersionPageWrapper>
  );
}
