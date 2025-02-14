"use client";

import React, { useEffect } from "react";
import Header from "@/components/shared/layout/Header";
import Footer from "@/components/shared/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import PaaSHero from "./PaaSHero";
import PaaSUsers from "./PaaSUsers";
import PaaSFeatures from "./PaaSFeatures";
import PaaSIntegration from "./PaaSIntegration";
import PaaSUseCases from "./PaaSUseCases";
import PaaSCTA from "./PaaSCTA";
import EphemeralDocumentation from "./EphemeralDocumentation";
import { useVersion } from "@/lib/version/VersionContext";

export default function PaasContent() {
  const { setVersion } = useVersion();

  useEffect(() => {
    setVersion("cloud");
  }, [setVersion]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-1">
        <PaaSHero />
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
        <PaaSUsers />
        <PaaSFeatures />
        <PaaSIntegration />
        <PaaSUseCases />
        <EphemeralDocumentation />
        <PaaSCTA />
      </main>
      <Footer />
    </div>
  );
}
