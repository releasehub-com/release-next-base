"use client";

import React from "react";
import { ArrowRight, Bot, Rocket, GitBranch, Cpu } from "lucide-react";
import Link from "next/link";

const useCases = [
  {
    title: "AI Development Teams",
    description:
      "Support teams using AI-powered development tools with infrastructure that can keep up with accelerated development cycles.",
    icon: Bot,
  },
  {
    title: "High-Velocity Teams",
    description:
      "Eliminate infrastructure bottlenecks for teams pushing multiple releases per day with automated scaling and instant environments.",
    icon: Rocket,
  },
  {
    title: "Feature Branch Testing",
    description:
      "Automatically create isolated environments for each feature branch, enabling parallel testing without resource conflicts.",
    icon: GitBranch,
  },
  {
    title: "ML/AI Workloads",
    description:
      "Optimize infrastructure for machine learning and AI workloads with intelligent resource allocation and scaling.",
    icon: Cpu,
  },
];

export default function AIPipelineUseCases() {
  return (
    <section className="py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Perfect For Modern Development Teams
          </h2>
          <p className="text-xl text-gray-300">
            Infrastructure solutions for teams embracing AI-accelerated
            development.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <div
                key={index}
                className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#00bb93]/10 rounded-lg">
                    <Icon className="w-6 h-6 text-[#00bb93]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {useCase.title}
                    </h3>
                    <p className="text-gray-300">{useCase.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <Link
            href="/book-a-demo"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg text-white bg-[#00bb93] hover:bg-[#00bb93]/90 transition-colors"
          >
            See How It Works
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
