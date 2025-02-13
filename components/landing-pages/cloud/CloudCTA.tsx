"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CloudCTA() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white mb-8">
          Ready to Transform Your Cloud Development?
        </h2>
        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Start building on Release today and experience the perfect balance of
          simplicity and power.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="https://release.com/signup">
            <Button
              size="lg"
              className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90"
            >
              Deploy Your First Application
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/book-a-demo">
            <Button
              size="lg"
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              Schedule a Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
