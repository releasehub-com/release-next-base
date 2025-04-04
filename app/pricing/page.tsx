import type { Metadata } from "next";
import { metadata } from "./metadata";
import PricingRedirect from "./components/PricingRedirect";

export { metadata };

export default function PricingPage() {
  return <PricingRedirect />;
}
