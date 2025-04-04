"use client";

import HomeContent from "./components/HomeContent";
import VersionPageWrapper from "@/components/shared/layout/VersionPageWrapper";

export default function HomePage() {
  return (
    <VersionPageWrapper includeLayout={true}>
      <HomeContent />
    </VersionPageWrapper>
  );
}
