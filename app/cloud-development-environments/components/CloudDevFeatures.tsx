"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Cloud,
  Code,
  Zap,
  GitBranch,
  Globe,
  Terminal,
  Cpu,
  Database,
  Server,
  Workflow,
} from "lucide-react";
import Link from "next/link";

export default function CloudDevFeaturesComponent() {
  return (
    <section
      id="features"
      className="w-full py-12 md:py-24 lg:py-32 bg-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">
          Key Features of Cloud Development with Release
        </h2>
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {[
            {
              title: "Powerful Cloud Resources",
              description:
                "Access high-performance computing resources regardless of your local machine's capabilities, perfect for resource-intensive applications.",
              icon: Cpu,
            },
            {
              title: "Complex Distributed Applications",
              description:
                "Develop and run complex, multi-service applications with ease, leveraging cloud infrastructure for all necessary services and dependencies.",
              icon: Server,
            },
            {
              title: "Local-like Experience",
              description:
                "Enjoy a seamless, local-like development experience while harnessing the full power of cloud infrastructure and services.",
              icon: Code,
            },
            {
              title: "Instant Environment Setup",
              description:
                "Rapidly create fully-configured development environments, complete with databases and services, enabling immediate productivity.",
              icon: Zap,
            },
            {
              title: "Bring Your Own IDE",
              description:
                "Use any development IDE you prefer - developers aren't forced into a paradigm that doesn't fit their workflow. Your favorite editor, your way.",
              icon: Terminal,
            },
            {
              title: "Consistent Environments",
              description:
                "Ensure all developers work in identical environments, minimizing 'it works on my machine' issues and reducing production deployment errors.",
              icon: GitBranch,
            },
            {
              title: "Access Anywhere",
              description:
                "Work from any device with an internet connection, while using your familiar tools and preferred IDE.",
              icon: Globe,
            },
            {
              title: "Integrated Services",
              description:
                "Seamlessly work with microservices, databases, and cloud-native applications in a fully integrated environment.",
              icon: Database,
            },
            {
              title: "Custom Workflows",
              description:
                "Create and manage custom development workflows tailored to your project's specific needs and requirements.",
              icon: Workflow,
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="bg-gray-700 border-gray-700 hover:border-[#00bb93] transition-colors duration-300"
            >
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <feature.icon className="mr-2 h-6 w-6 text-[#00bb93]" />
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="https://docs.release.com/cli/remote-dev">
            <Button className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90">
              Explore All Cloud Dev Features
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
