import type { Metadata } from "next";
import { metadata } from "./metadata";
import BookADemoContent from "./components/BookADemoContent";
import VersionPageWrapper from "@/components/shared/layout/VersionPageWrapper";

export { metadata };

export default function BookADemoPage() {
  return (
    <VersionPageWrapper>
      <BookADemoContent />
    </VersionPageWrapper>
  );
}
