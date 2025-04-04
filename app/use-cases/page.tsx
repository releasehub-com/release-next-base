import type { Metadata } from "next";
import { metadata } from "./metadata";
import UseCasesContent from "./components/UseCasesContent";

export { metadata };

export default function UseCasesPage() {
  return <UseCasesContent />;
}
