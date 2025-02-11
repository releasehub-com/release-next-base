"use client";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Link from "next/link";
import type { Metadata } from "next";
import CalendlyButton from "@/app/product/release-delivery/components/CalendlyButton";

interface RootSEOPageLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  openGraph?: Metadata["openGraph"];
  twitter?: Metadata["twitter"];
  calendlyUrl?: string;
}

function HeroButton({ calendlyUrl }: { calendlyUrl?: string }) {
  if (calendlyUrl) {
    return (
      <CalendlyButton
        className="inline-flex items-center px-8 py-3 text-base font-medium rounded-md text-white bg-[#00bb93] hover:bg-[#00bb93]/90 transition-colors shadow-sm whitespace-nowrap cursor-pointer"
        url={calendlyUrl}
      >
        Book Demo
      </CalendlyButton>
    );
  }

  return (
    <Link
      href="/book-a-demo"
      className="inline-flex items-center px-8 py-3 text-base font-medium rounded-md text-white bg-[#00bb93] hover:bg-[#00bb93]/90 transition-colors shadow-sm whitespace-nowrap"
    >
      Book Demo
    </Link>
  );
}

function CTASection({ calendlyUrl }: { calendlyUrl?: string }) {
  return (
    <section className="mt-16 bg-gray-800 border-y border-gray-800 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Release Your Ideas
          </h2>
          <p className="text-gray-400 text-lg">
            Start today, or contact us with any questions.
          </p>
        </div>
        <div className="flex justify-center">
          {calendlyUrl ? (
            <CalendlyButton
              className="w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-md text-white bg-[#00bb93] hover:bg-[#00bb93]/90 transition-colors shadow-lg cursor-pointer"
              url={calendlyUrl}
            >
              Book Demo
            </CalendlyButton>
          ) : (
            <Link
              href="/book-a-demo"
              className="w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-md text-white bg-[#00bb93] hover:bg-[#00bb93]/90 transition-colors shadow-lg"
            >
              Book Demo
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default function RootSEOPageLayout({
  children,
  title,
  description,
  openGraph,
  twitter,
  calendlyUrl,
}: RootSEOPageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />
      <section className="bg-gray-800 border-y border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {title}
            </h1>
            <HeroButton calendlyUrl={calendlyUrl} />
          </div>
        </div>
      </section>
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <article className="prose prose-invert prose-lg max-w-none">
            {children}
          </article>
        </div>
        <CTASection calendlyUrl={calendlyUrl} />
      </main>
      <Footer />
    </div>
  );
}
