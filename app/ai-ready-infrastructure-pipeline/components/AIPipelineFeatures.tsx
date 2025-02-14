"use client";

import React from "react";
import { Rocket, Zap, Scale, GitBranch, Cpu, Users } from "lucide-react";

const features = [
  {
    title: "Preserve Your AI Investment",
    description:
      "Don't let traditional staging bottlenecks waste your AI tooling investment. Parallel environments ensure your infrastructure keeps up with AI-accelerated development speed.",
    icon: Users,
  },
  {
    title: "Zero-Wait Deployments",
    description:
      "Traditional environments force AI-powered teams to wait in deployment queues, killing productivity. Release gives every PR its own instant environment—no waiting required.",
    icon: Rocket,
  },
  {
    title: "Automated Environment Lifecycle",
    description:
      "While traditional environments need manual cleanup and maintenance, Release automatically manages the full environment lifecycle. Focus on building with AI, not managing infrastructure.",
    icon: GitBranch,
  },
  {
    title: "AI-Optimized Infrastructure",
    description:
      "Traditional environments weren't built for AI workloads. Release environments are optimized for AI/ML testing and validation, ensuring your testing matches production.",
    icon: Cpu,
  },
  {
    title: "Scale With AI Velocity",
    description:
      "As AI tools accelerate your development pace, your infrastructure automatically scales to match. No more infrastructure bottlenecks slowing down your AI-powered teams.",
    icon: Scale,
  },
  {
    title: "Parallel Development Flows",
    description:
      "Traditional staging creates a single-lane bottleneck. Release enables truly parallel development, letting your AI-powered team deploy and test simultaneously.",
    icon: Zap,
  },
];

export default function AIPipelineFeatures() {
  return (
    <section className="py-20 bg-gray-800/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Don't Let Infrastructure Waste Your AI Investment
          </h2>
          <p className="text-xl text-gray-300">
            Traditional environments create bottlenecks that erase the speed
            gains from AI development. Release preserves your AI efficiency with
            parallel, automated infrastructure.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50"
              >
                <div className="flex flex-col items-start gap-4">
                  <div className="p-2 bg-[#00bb93]/10 rounded-lg">
                    <Icon className="w-6 h-6 text-[#00bb93]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
