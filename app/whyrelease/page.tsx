import type { Metadata } from "next";
import WhyReleaseContent from "./components/WhyReleaseContent";
import { metadata } from "./metadata";

export { metadata };

export default function WhyReleasePage() {
  return <WhyReleaseContent />;
}
