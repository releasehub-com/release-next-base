import type { Metadata } from "next";
import { metadata } from "./metadata";
import UATContent from "./components/UATContent";

export { metadata };

export default function UATPage() {
  return <UATContent />;
}
