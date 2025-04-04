"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Cloud,
  ArrowRight,
  Terminal,
  Code,
  GitBranch,
  Link2,
  GitPullRequest,
  Clock,
  Zap,
  Lock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PaaSFeatures() {
  return (
    <section
      id="features"
      className="w-full py-12 md:py-24 lg:py-32 bg-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-4 text-white">
          Start Simple, Scale Without Limits
        </h2>
        <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
          Begin with our hosted cloud platform for Heroku-like simplicity, then
          seamlessly upgrade to enterprise features as you grow.
        </p>
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {[
            {
              title: "Simple Git Deployments",
              description:
                "Deploy applications with a simple git push, just like Heroku. Automatic builds, deployments, and rollbacks included.",
              links: [
                {
                  href: "https://docs.release.com/getting-started/quickstart",
                  text: "Quick Start Guide",
                  icon: GitBranch,
                },
                {
                  href: "https://docs.release.com/integrations/source-control-integrations",
                  text: "Source Control Integrations",
                  icon: GitPullRequest,
                },
              ],
            },
            {
              title: "Managed Cloud Infrastructure",
              description:
                "Start with our fully managed cloud platform. No infrastructure management required - we handle scaling, security, and maintenance.",
              link: {
                href: "https://web.release.com/pricing",
                text: "Release Cloud Platform Features",
                icon: Cloud,
              },
            },
            {
              title: "Developer-First Experience",
              description:
                "Built for developers with intuitive CLI, comprehensive API, and seamless GitHub integration. Everything you loved about Heroku, made better.",
              link: {
                href: "https://docs.release.com/cli",
                text: "CLI Documentation",
                icon: Terminal,
              },
            },
            {
              title: "Enterprise-Ready Upgrade Path",
              description:
                "As you grow, seamlessly transition to running in your own cloud account with advanced security, compliance, and customization options.",
              links: [
                {
                  href: "https://docs.release.com/enterprise",
                  text: "Enterprise Features",
                  icon: Lock,
                },
                {
                  href: "https://docs.release.com/enterprise/migration",
                  text: "Migration Guide",
                  icon: ArrowRight,
                },
              ],
            },
            {
              title: "Full Cloud Provider Access",
              description:
                "Enterprise users get direct access to AWS, GCP, or Azure services while maintaining the simple developer experience.",
            },
            {
              title: "Lightning-Fast Performance",
              description:
                "Optimized infrastructure with global CDN, automatic scaling, and performance monitoring built-in.",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="bg-gray-700 border-gray-700 hover:border-[#00bb93] transition-colors duration-300"
            >
              <CardHeader>
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{feature.description}</p>
                {feature.link && (
                  <Link
                    href={feature.link.href}
                    className="flex items-center text-[#00bb93] hover:underline mt-4"
                  >
                    <feature.link.icon className="mr-2 h-5 w-5" />
                    {feature.link.text}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                )}
                {feature.links && (
                  <div className="space-y-2 mt-4">
                    {feature.links.map((link, i) => (
                      <Link
                        key={i}
                        href={link.href}
                        className="flex items-center text-[#00bb93] hover:underline"
                      >
                        <link.icon className="mr-2 h-5 w-5" />
                        {link.text}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
