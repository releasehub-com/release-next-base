"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Cloud,
  Key,
  Database,
  GitBranch,
  Shield,
  Zap,
  Puzzle,
  Wand2,
  LinkIcon,
  Workflow,
} from "lucide-react";

export default function EphemeralIntegration() {
  return (
    <section
      id="how-it-works"
      className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-900 to-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
            Making Adoption Easy
          </h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Adopting ephemeral environments can seem daunting. At Release, we've
            spent years tackling this challenge, creating seamless solutions
            that make onboarding effortless and turn perceived hurdles into
            stepping stones for innovation.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gray-800 border-gray-700 hover:border-[#00bb93] transition-colors duration-300 md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-2xl">
                <FileText className="mr-2 h-6 w-6 text-[#00bb93]" />
                Battle Tested Patterns Encapsulated in the Release Application
                Template
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-1">
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start">
                    <Shield className="mr-2 h-5 w-5 text-[#00bb93] mt-1 flex-shrink-0" />
                    <span>
                      Single source of truth for managing applications and
                      environments
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="mr-2 h-5 w-5 text-[#00bb93] mt-1 flex-shrink-0" />
                    <span>
                      Encapsulates years of experience and best practices from
                      hundreds of customer setups
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Puzzle className="mr-2 h-5 w-5 text-[#00bb93] mt-1 flex-shrink-0" />
                    <span>
                      Simplifies configuration and deployment for smooth
                      onboarding and efficient operations
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Wand2 className="mr-2 h-5 w-5 text-[#00bb93] mt-1 flex-shrink-0" />
                    <span>
                      Auto-generation from customer repositories for easy
                      start-up
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Workflow className="mr-2 h-5 w-5 text-[#00bb93] mt-1 flex-shrink-0" />
                    <span>
                      Built-in workflow engine for custom environment creation
                      and teardown actions, including database migrations
                    </span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="https://docs.release.com/reference-documentation/application-settings/application-template">
                    <Button
                      variant="outline"
                      className="w-full md:w-auto border-[#00bb93] text-[#00bb93] hover:bg-[#00bb93] hover:text-white"
                    >
                      Learn More About Application Templates
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-900 rounded-md p-4 overflow-hidden">
                <pre className="text-xs md:text-sm text-gray-300 overflow-x-auto">
                  <code>{`# Release Application Template
name: my-application
components:
  frontend:
    build:
      context: ./frontend
    env:
      - name: API_URL
        value: http://backend:3000
  backend:
    build:
      context: ./backend
    env:
      - name: DATABASE_URL
        fromSecret: db-connection
secrets:
  - name: db-connection
    type: environment
    key: DATABASE_URL`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-[#00bb93] transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <LinkIcon className="mr-2 h-5 w-5 text-[#00bb93]" />
                Key Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <GitBranch className="mr-2 h-4 w-4 text-[#00bb93]" />
                  Seamless CI/CD integration
                </li>
                <li className="flex items-center">
                  <Cloud className="mr-2 h-4 w-4 text-[#00bb93]" />
                  Docker Compose and Kubernetes compatibility
                </li>
                <li className="flex items-center">
                  <Shield className="mr-2 h-4 w-4 text-[#00bb93]" />
                  Helm charts and Terraform support
                </li>
                <li className="flex items-center">
                  <Zap className="mr-2 h-4 w-4 text-[#00bb93]" />
                  Static JavaScript generation support
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-[#00bb93] transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Cloud className="mr-2 h-5 w-5 text-[#00bb93]" />
                Cloud Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Support for major cloud providers, enabling diverse environments
                from static websites to complex, multi-service applications.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-[#00bb93] transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Key className="mr-2 h-5 w-5 text-[#00bb93]" />
                Secrets Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Secure handling of environment variables and sensitive data,
                with support for major secrets managers like AWS Secrets Manager
                and Doppler.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-[#00bb93] transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="mr-2 h-5 w-5 text-[#00bb93]" />
                Instant Datasets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Create and manage realistic datasets for testing and
                development, enabling data-driven testing and replication of
                production-like scenarios.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 bg-gray-700 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">
            Continuous Improvement
          </h3>
          <p className="text-gray-300 text-center max-w-3xl mx-auto">
            Our platform evolves with each customer interaction, building
            solutions for future users based on real-world challenges. This
            commitment ensures you're always working with a platform that's at
            the forefront of ephemeral environment technology.
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link href="https://docs.release.com/#how-release-works">
            <Button
              size="lg"
              className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90"
            >
              Release Docs: How it Works
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
