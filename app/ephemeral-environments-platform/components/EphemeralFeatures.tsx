"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Database,
  ArrowRight,
  Terminal,
  Code,
  GitBranch,
  Link2,
  GitPullRequest,
  Clock,
  TestTube,
  Repeat,
} from "lucide-react";
import Link from "next/link";

export default function EphemeralFeatures() {
  return (
    <section
      id="features"
      className="w-full py-12 md:py-24 lg:py-32 bg-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">
          Key Features of Release
        </h2>
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {[
            {
              title: "Automated Review Environments",
              description:
                "Generate full-stack environments automatically for every pull request or by using GitHub labels, enabling comprehensive testing and review workflows.",
              links: [
                {
                  href: "https://docs.release.com/reference-documentation/application-settings/github-1",
                  text: "PR-Based Environments",
                  icon: GitPullRequest,
                },
                {
                  href: "https://docs.release.com/reference-documentation/application-settings/github",
                  text: "Label-Based Environments",
                  icon: GitPullRequest,
                },
              ],
            },
            {
              title: "Self-Service Platform for Developer Empowerment",
              description:
                "Provision environments automatically using GitOps integration. Each environment comes with secure, shareable links for easy collaboration and review.",
              links: [
                {
                  href: "https://docs.release.com/reference-documentation/gitops#gitops-workflow",
                  text: "Learn About GitOps Workflow",
                  icon: GitBranch,
                },
                {
                  href: "https://docs.release.com/reference-documentation/application-settings/primary-app-link",
                  text: "Learn About Shareable Links",
                  icon: Link2,
                },
              ],
            },
            {
              title: "Remote Development Environments",
              description:
                "Offer remote development environments that can be 'mounted' to a developer's local computer, facilitating seamless development workflows.",
              link: {
                href: "https://docs.release.com/cli/remote-dev",
                text: "Learn About Remote Development",
                icon: Code,
              },
            },
            {
              title: "Accelerated Iteration and End-to-End Testing",
              description:
                "The entire process of building an environment from code to build to test to deploy is handled by Release for each branch a developer is working on. This allows teams to identify and address issues earlier in the development process, eliminating dependencies on traditional staging deployments.",
              links: [
                {
                  href: "https://docs.release.com/reference-documentation/e2e-testing",
                  text: "Learn About End-to-End Testing",
                  icon: TestTube,
                },
                {
                  href: "https://docs.release.com/guides-and-examples/advanced-guides/application",
                  text: "Explore the Application Lifecycle",
                  icon: Repeat,
                },
              ],
            },
            {
              title: "Cost Efficiency",
              description:
                "Provide on-demand environments that scale to zero when inactive, resulting in significant reductions in pre-production cloud costs. Environments can be created only when needed, put on a schedule, or paused, leading to savings ranging from 30-70%.",
              link: {
                href: "https://docs.release.com/guides-and-examples/advanced-guides/pausing-instant-datasets/pausing-resuming-environments",
                text: "Learn About Pausing and Resuming Environments",
                icon: Clock,
              },
            },
            {
              title: "Environment Data Management",
              description:
                "Utilize Release's Instant Datasets to create and manage realistic datasets for testing and development, enabling data-driven testing and replication of production-like scenarios.",
              link: {
                href: "https://docs.release.com/reference-documentation/instant-datasets-aws",
                text: "Learn About Instant Datasets",
                icon: Database,
              },
            },
            {
              title: "Command Line Interface",
              description:
                "Create and deploy Release environments, stream logs, and manage your infrastructure directly from the command line with our powerful CLI tool.",
              link: {
                href: "https://docs.release.com/cli/getting-started",
                text: "Get Started with Release CLI",
                icon: Terminal,
              },
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
