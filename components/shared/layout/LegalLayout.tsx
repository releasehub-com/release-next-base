"use client";

import React from "react";
import Header from "@/components/shared/layout/Header";
import Footer from "@/components/shared/layout/Footer";

interface LegalLayoutProps {
  children: React.ReactNode;
}

export default function LegalLayout({ children }: LegalLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="max-w-4xl mx-auto">{children}</article>
      </main>
      <Footer />
    </div>
  );
}
