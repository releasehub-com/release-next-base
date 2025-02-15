import type { Metadata } from "next";
import PartnerList from "./components/PartnerList";
import Header from "@/components/shared/layout/Header";
import Footer from "@/components/shared/layout/Footer";
import { metadata } from "./metadata";

export { metadata };

export default function PartnersPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <PartnerList />
      </main>
      <Footer />
    </>
  );
}
