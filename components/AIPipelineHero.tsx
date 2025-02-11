"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AIPipelineHero() {
  return (
    <section className="relative overflow-hidden py-8 sm:py-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-[#00bb93] text-xl sm:text-2xl font-medium mb-4">
                Don't Let Traditional Environments Kill Your AI Gains
              </h2>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                AI Makes Your Devs 10x Faster.
                <br />
                Release Makes Your Infrastructure Keep Up.
              </h1>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed">
              You've invested in AI-powered development to accelerate your
              team's productivity—but traditional staging environments erase
              those gains by making developers wait in line to deploy. Release's
              ephemeral environments ensure your infrastructure investment
              matches your AI investment, with instant, parallel environments
              that let every developer deploy and test simultaneously.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-lg text-white bg-[#00bb93] hover:bg-[#00bb93]/90 transition-colors"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/book-a-demo"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                Book Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden bg-white/[0.15] backdrop-blur-[2px] border border-white/[0.2] p-4 sm:p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.2] to-transparent pointer-events-none"></div>
              <div className="relative rounded-xl overflow-hidden">
                <Image
                  src="/images/ai-pipeline/hero.svg"
                  alt="AI-Ready Infrastructure Pipeline Interface"
                  width={2000}
                  height={1200}
                  className="w-full h-auto"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
