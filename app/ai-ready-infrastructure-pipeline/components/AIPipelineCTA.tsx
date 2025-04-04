"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AIPipelineCTA() {
  return (
    <section className="py-20 bg-gray-800/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Accelerate Your Infrastructure?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join the teams who have eliminated infrastructure bottlenecks and
            matched their deployment velocity to their AI-accelerated
            development pace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg text-white bg-[#00bb93] hover:bg-[#00bb93]/90 transition-colors"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/book-a-demo"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              Book Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
