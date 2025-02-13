"use client";

import React from "react";
import Header from "@/components/shared/layout/Header";
import Footer from "@/components/shared/layout/Footer";
import CloudHero from "./CloudHero";
import CloudUsers from "./CloudUsers";
import CloudFeatures from "./CloudFeatures";
import CloudIntegration from "./CloudIntegration";
import CloudUseCases from "./CloudUseCases";
import EphemeralDocumentation from "../ephemeral/EphemeralDocumentation";
import CloudCTA from "./CloudCTA";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CloudLanding() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-1">
        <CloudHero />
        <div className="bg-gray-800/50 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-6 flex-wrap">
            <p className="text-lg text-gray-300">
              Migrating from Heroku? We'll help make the migration simple.
            </p>
            <Link href="/book-a-demo">
              <Button className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90">
                Schedule a Meeting
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <CloudUsers />
        <CloudFeatures />
        <CloudIntegration />
        <CloudUseCases />
        <EphemeralDocumentation />
        <CloudCTA />
      </main>
      <Footer />
    </div>
  );
}
