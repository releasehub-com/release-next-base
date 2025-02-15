import type { Metadata } from "next";
import { metadata } from "./metadata";
import HerokuRedirectContent from "./components/HerokuRedirectContent";
import VersionPageWrapper from "@/components/shared/layout/VersionPageWrapper";
import { Suspense } from "react";

export { metadata };

export default function HerokuCompetitorPage() {
  return (
    <VersionPageWrapper includeLayout={true}>
      <Suspense fallback={<div>Loading...</div>}>
        <HerokuRedirectContent />
      </Suspense>
    </VersionPageWrapper>
  );
}
