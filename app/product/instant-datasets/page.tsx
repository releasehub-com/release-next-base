import type { Metadata } from "next";
import InstantDatasetsContent from "./components/InstantDatasetsContent";
import { metadata } from "./metadata";

export { metadata };

export default function InstantDatasetsPage() {
  return <InstantDatasetsContent />;
}
