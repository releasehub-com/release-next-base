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
  Laptop,
} from "lucide-react";

export default function CloudDevIntegrationComponent() {
  return (
    <section
      id="how-it-works"
      className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-900 to-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
            Making Adoption of Cloud Development Environments Easy
          </h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Transitioning to cloud development environments can seem complex. At
            Release, we've dedicated years to streamlining this process,
            creating intuitive solutions that make setup effortless and turn
            perceived challenges into opportunities for enhanced productivity.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gray-800 border-gray-700 hover:border-[#00bb93] transition-colors duration-300 md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-2xl">
                <FileText className="mr-2 h-6 w-6 text-[#00bb93]" />
                Proven Patterns Embedded in Release Cloud Development
                Environments
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-1">
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start">
                    <Shield className="mr-2 h-5 w-5 text-[#00bb93] mt-1 flex-shrink-0" />
                    <span>
                      Centralized management of cloud development environments
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="mr-2 h-5 w-5 text-[#00bb93] mt-1 flex-shrink-0" />
                    <span>
                      Incorporates best practices from numerous customer
                      implementations
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Puzzle className="mr-2 h-5 w-5 text-[#00bb93] mt-1 flex-shrink-0" />
                    <span>
                      Simplifies setup and configuration for quick developer
                      onboarding
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Wand2 className="mr-2 h-5 w-5 text-[#00bb93] mt-1 flex-shrink-0" />
                    <span>
                      Automatic environment creation from your existing
                      repositories
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Workflow className="mr-2 h-5 w-5 text-[#00bb93] mt-1 flex-shrink-0" />
                    <span>
                      Integrated workflow engine for custom environment setup,
                      including database provisioning
                    </span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="https://docs.release.com/cli/remote-dev">
                    <Button className="w-full md:w-auto bg-[#00bb93] text-white hover:bg-[#00bb93]/90">
                      Learn More About Cloud Dev Environments
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-900 rounded-md p-4 overflow-hidden">
                <pre className="text-xs md:text-sm text-gray-300 overflow-x-auto">
                  <code>{`development_environment:
  services:
    - name: vote
      command: python app.py
      sync:
        - remote_path: "/app"
          local_path: "./vote"`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-[#00bb93] transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <LinkIcon className="mr-2 h-5 w-5 text-[#00bb93]" />
                Seamless Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <GitBranch className="mr-2 h-4 w-4 text-[#00bb93]" />
                  Git version control integration
                </li>
                <li className="flex items-center">
                  <Cloud className="mr-2 h-4 w-4 text-[#00bb93]" />
                  Major cloud provider compatibility
                </li>
                <li className="flex items-center">
                  <Shield className="mr-2 h-4 w-4 text-[#00bb93]" />
                  Popular IDE and tooling support
                </li>
                <li className="flex items-center">
                  <Zap className="mr-2 h-4 w-4 text-[#00bb93]" />
                  CI/CD pipeline integration
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-[#00bb93] transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Key className="mr-2 h-5 w-5 text-[#00bb93]" />
                Secure Access Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Robust security measures for managing access to cloud
                environments, including integration with your existing
                authentication systems.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-[#00bb93] transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="mr-2 h-5 w-5 text-[#00bb93]" />
                Instant Environment Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Rapidly create fully-configured development environments,
                complete with necessary databases and services, enabling
                immediate productivity.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 bg-gray-700 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">
            Ongoing Innovation
          </h3>
          <p className="text-gray-300 text-center max-w-3xl mx-auto">
            Our platform continuously evolves based on real-world usage and
            feedback, ensuring you're always working with cutting-edge cloud
            development technology that addresses the latest challenges in
            software development.
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link href="https://docs.release.com/cli/remote-dev">
            <Button
              size="lg"
              className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90"
            >
              Explore Cloud Dev Documentation
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
