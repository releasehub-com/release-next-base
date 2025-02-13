"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Cloud, Code, GitBranch, Server } from "lucide-react";

export default function CloudDocumentation() {
  return (
    <section
      id="documentation-support"
      className="w-full py-12 md:py-24 lg:py-32"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white mb-4">
            Simple to Start, Powerful When Needed
          </h2>
          <p className="text-xl text-gray-300">
            Comprehensive documentation for both our Cloud Platform and
            Enterprise solutions, with clear migration paths as you grow.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="relative">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-16 bg-[#00bb93] rounded-full" />
              <div className="pl-6">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                  <Cloud className="mr-3 h-6 w-6 text-[#00bb93]" />
                  Cloud Platform
                </h3>
                <p className="text-gray-300">
                  Get started quickly with our managed cloud platform. Simple
                  git-based deployments, managed databases, and automatic
                  scaling.
                </p>
                <Link
                  href="https://docs.release.com/cloud-platform"
                  className="inline-flex items-center mt-2 text-[#00bb93] hover:text-[#00bb93]/80"
                >
                  Cloud Platform Documentation →
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-16 bg-[#00bb93] rounded-full" />
              <div className="pl-6">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                  <Server className="mr-3 h-6 w-6 text-[#00bb93]" />
                  Enterprise Features
                </h3>
                <p className="text-gray-300">
                  Advanced features for enterprise needs: custom infrastructure,
                  compliance tools, and full cloud provider access.
                </p>
                <Link
                  href="https://docs.release.com/enterprise"
                  className="inline-flex items-center mt-2 text-[#00bb93] hover:text-[#00bb93]/80"
                >
                  Enterprise Documentation →
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-gray-700/50 border-gray-600">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="bg-[#00bb93]/10 p-3 rounded-lg">
                    <GitBranch className="h-6 w-6 text-[#00bb93]" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-white">
                      Quick Start Guide
                    </h4>
                    <p className="text-sm text-gray-400">
                      Deploy your first app in minutes
                    </p>
                    <Link href="https://docs.release.com/quickstart">
                      <Button
                        variant="link"
                        className="mt-2 text-[#00bb93] p-0 h-auto"
                      >
                        Get Started →
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-700/50 border-gray-600">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="bg-[#00bb93]/10 p-3 rounded-lg">
                    <Code className="h-6 w-6 text-[#00bb93]" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-white">
                      Migration Guides
                    </h4>
                    <p className="text-sm text-gray-400">
                      Seamless transition from Heroku
                    </p>
                    <Link href="https://docs.release.com/migrations/heroku">
                      <Button
                        variant="link"
                        className="mt-2 text-[#00bb93] p-0 h-auto"
                      >
                        View Guide →
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
