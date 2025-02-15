import type { Metadata } from "next";
import { metadata } from "./metadata";
import StagingContent from "./components/StagingContent";

export { metadata };

export default function StagingEnvironmentsPage() {
  return <StagingContent />;
}
