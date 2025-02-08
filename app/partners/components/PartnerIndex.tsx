"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Partner } from "../types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PartnerCTA from "./PartnerCTA";

interface PartnerIndexProps {
  partners: Partner[];
}

export default function PartnerIndex({ partners }: PartnerIndexProps) {
  // Get unique categories
  const categories = [
    "All Partners",
    ...new Set(partners.map((p) => p.category)),
  ];
  const [selectedCategory, setSelectedCategory] = useState("All Partners");

  // Filter partners based on selected category
  const filteredPartners = partners.filter(
    (partner) =>
      selectedCategory === "All Partners" ||
      partner.category === selectedCategory,
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        {/* Hero section with gradient background */}
        <div className="bg-gradient-to-b from-gray-800/50 to-gray-900 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 max-w-5xl mx-auto leading-tight">
                Release Partnerships ensure you get the integrations,
                <br className="hidden md:block" />
                support and innovations you need to get the most out of your
                investment.
              </h1>
            </div>
          </div>
        </div>

        {/* Partners section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="mb-16">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${
                      selectedCategory === category
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Partners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPartners.map((partner) => (
                <Link
                  key={partner.slug}
                  href={partner.externalLink || `/partners/${partner.slug}`}
                  className="group"
                  target={partner.externalLink ? "_blank" : undefined}
                >
                  <article className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors h-full">
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="p-6">
                      <div className="text-purple-400 text-sm font-medium mb-2">
                        {partner.category.toUpperCase()}
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                        {partner.name}
                      </h3>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Partner CTA moved inside main content, before Footer */}
          <div className="pb-24">
            <PartnerCTA />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
