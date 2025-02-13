"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  ArrowRight,
  Cloud,
  Lock,
  Rocket,
  Scale,
  Server,
  Shield,
} from "lucide-react";

export default function CloudUseCases() {
  return (
    <section
      id="use-cases"
      className="w-full py-12 md:py-24 lg:py-32 bg-gray-900"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">
          From Startup to Enterprise
        </h2>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="bg-gray-800 border-gray-700 hover:border-[#00bb93] transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Rocket className="mr-2 h-6 w-6 text-[#00bb93]" />
                Start Fast with the Release Cloud Platform
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Perfect for startups and teams that want Heroku-like simplicity.
                Deploy quickly with managed infrastructure and focus on building
                your product.
              </p>
              <Link
                href="https://web.release.com/pricing"
                className="flex items-center text-[#00bb93] hover:underline"
              >
                <Cloud className="mr-2 h-5 w-5" />
                Release Cloud Platform Features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-[#00bb93] transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Scale className="mr-2 h-6 w-6 text-[#00bb93]" />
                Scale with Your Growth
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                As your needs grow, seamlessly scale your infrastructure and
                transition to more advanced features without changing your
                workflow.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-[#00bb93] transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="mr-2 h-6 w-6 text-[#00bb93]" />
                Enterprise-Grade Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Get full control over your infrastructure with enterprise
                features, advanced security, and compliance capabilities in your
                own cloud account.
              </p>
              <Link
                href="https://web.release.com/pricing"
                className="flex items-center text-[#00bb93] hover:underline"
              >
                <Lock className="mr-2 h-5 w-5" />
                Enterprise Features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
