"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Cloud,
  Key,
  Database,
  GitBranch,
  Shield,
  Zap,
  Puzzle,
  Server,
  Scale,
} from "lucide-react";

export default function PaaSIntegration() {
  return (
    <section
      id="how-it-works"
      className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-900 to-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
            Scale Your Way
          </h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Start with our managed cloud platform for simplicity, then
            seamlessly transition to enterprise-grade infrastructure in your own
            cloud account as you grow.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-gray-800 border-gray-700 hover:border-[#00bb93] transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-2xl">
                <Cloud className="mr-2 h-6 w-6 text-[#00bb93]" />
                Release Cloud Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <Zap className="mr-2 h-5 w-5 text-[#00bb93] mt-1 flex-shrink-0" />
                  <span>Instant deployment with git push</span>
                </li>
                <li className="flex items-start">
                  <Shield className="mr-2 h-5 w-5 text-[#00bb93] mt-1 flex-shrink-0" />
                  <span>Fully managed infrastructure</span>
                </li>
                <li className="flex items-start">
                  <Database className="mr-2 h-5 w-5 text-[#00bb93] mt-1 flex-shrink-0" />
                  <span>Managed databases and add-ons</span>
                </li>
                <li className="flex items-start">
                  <Scale className="mr-2 h-5 w-5 text-[#00bb93] mt-1 flex-shrink-0" />
                  <span>Automatic scaling and load balancing</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="https://web.release.com/pricing">
                  <Button className="w-full bg-[#00bb93] text-white hover:bg-[#00bb93]/90">
                    Start with Cloud Platform
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-[#00bb93] transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-2xl">
                <Server className="mr-2 h-6 w-6 text-[#00bb93]" />
                Enterprise Self-Hosted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <Cloud className="mr-2 h-5 w-5 text-[#00bb93] mt-1 flex-shrink-0" />
                  <span>Run in your own cloud account</span>
                </li>
                <li className="flex items-start">
                  <Key className="mr-2 h-5 w-5 text-[#00bb93] mt-1 flex-shrink-0" />
                  <span>Full cloud provider capabilities</span>
                </li>
                <li className="flex items-start">
                  <Shield className="mr-2 h-5 w-5 text-[#00bb93] mt-1 flex-shrink-0" />
                  <span>Enhanced security and compliance</span>
                </li>
                <li className="flex items-start">
                  <Puzzle className="mr-2 h-5 w-5 text-[#00bb93] mt-1 flex-shrink-0" />
                  <span>Custom infrastructure and configurations</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="https://web.release.com/pricing">
                  <Button
                    variant="outline"
                    className="w-full border-[#00bb93] text-[#00bb93] hover:bg-[#00bb93] hover:text-white"
                  >
                    Learn About Enterprise
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
