import type { Metadata } from "next";
import { metadata } from "./metadata";
import ReleaseDeliveryContent from "./components/ReleaseDeliveryContent";

export { metadata };

export default function ReleaseDeliveryPage() {
  return <ReleaseDeliveryContent />;
}
