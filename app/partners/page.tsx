import { Metadata } from "next";
import PartnerIndex from "./components/PartnerIndex";
import { Partner } from "./types";
import { getPartners } from "./utils";

export const metadata: Metadata = {
  title: "Partners | Release",
  description: "Explore Release's technology and integration partners",
};

export default function PartnersPage() {
  const partners = getPartners();
  return <PartnerIndex partners={partners} />;
}
