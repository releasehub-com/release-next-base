"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckIcon, StarIcon, X } from "lucide-react";
import { useVersion } from "@/lib/version/VersionContext";

export default function GitLabContent() {
  const { setVersion } = useVersion();
  const searchParams = useSearchParams();
  const urlVersion = searchParams.get("version");

  useEffect(() => {
    // If no version in URL, set to gitlab
    if (!urlVersion) {
      setVersion("gitlab");
    }
  }, [urlVersion, setVersion]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-1">
        <section className="w-full py-6 md:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                    Release: The Superior Alternative to GitLab
                  </h1>
                  <p className="max-w-[600px] text-gray-400 md:text-xl">
                    Experience faster development cycles, automated
                    infrastructure, and significant cost savings. Release offers
                    everything GitLab does and more, with a focus on ephemeral
                    environments and streamlined DevOps.
                  </p>
                </div>
                <ul className="grid gap-2 py-4">
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" />{" "}
                    Ephemeral environments for every pull request
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" />{" "}
                    Automated infrastructure management
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" />{" "}
                    Seamless team collaboration
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" />{" "}
                    Significant cost savings compared to GitLab
                  </li>
                </ul>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90"
                    >
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link href="/book-a-demo">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-[#00bb93] text-[#00bb93] hover:bg-[#00bb93] hover:text-white"
                    >
                      Schedule Demo
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <blockquote className="text-lg font-semibold text-gray-100">
                    "Release offers a more modern, efficient approach to DevOps
                    compared to GitLab. It's revolutionized our workflow and
                    significantly reduced our infrastructure costs."
                  </blockquote>
                  <div className="mt-4 flex items-center">
                    <div>
                      <p className="font-semibold text-gray-100">Alex T.</p>
                      <p className="text-sm text-gray-400">CTO, Together</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                  title: "Ephemeral Environments",
                  description:
                    "Create disposable environments for every pull request, enabling faster review and testing processes.",
                },
                {
                  title: "Automated DevOps",
                  description:
                    "Let our platform handle infrastructure management, reducing the need for dedicated DevOps personnel.",
                },
                {
                  title: "Cost Optimization",
                  description:
                    "Pay only for what you use, significantly reducing infrastructure costs compared to GitLab's static environments.",
                },
                {
                  title: "Faster Development Cycles",
                  description:
                    "Streamline your workflow with ephemeral environment creation and automated deployments.",
                },
                {
                  title: "Enhanced Collaboration",
                  description:
                    "Share environments instantly with your team, improving communication and productivity.",
                },
                {
                  title: "GitLab Integration",
                  description:
                    "Seamlessly integrate with your existing GitLab repositories for a smooth transition.",
                },
              ].map((feature, index) => (
                <Card
                  key={`feature-${index}`}
                  className="bg-gray-700 border-gray-600"
                >
                  <CardHeader>
                    <CardTitle className="text-white">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="comparison" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">
              Release vs GitLab: The Clear Winner
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Release</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-100">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" />{" "}
                      Ephemeral environments for every PR
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" />{" "}
                      Automated infrastructure management
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" />{" "}
                      Pay-per-use pricing model
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" />{" "}
                      Faster development cycles
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" />{" "}
                      Reduced DevOps overhead
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">GitLab</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-100">
                    <li className="flex items-center">
                      <X className="mr-2 h-4 w-4 text-red-500" /> Limited
                      environment management
                    </li>
                    <li className="flex items-center">
                      <X className="mr-2 h-4 w-4 text-red-500" /> Manual
                      infrastructure setup required
                    </li>
                    <li className="flex items-center">
                      <X className="mr-2 h-4 w-4 text-red-500" /> Fixed pricing
                      tiers
                    </li>
                    <li className="flex items-center">
                      <X className="mr-2 h-4 w-4 text-red-500" /> Slower
                      deployment processes
                    </li>
                    <li className="flex items-center">
                      <X className="mr-2 h-4 w-4 text-red-500" /> Higher DevOps
                      resource requirements
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-800"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">
              How Release Works
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  title: "Connect",
                  description:
                    "Link your GitLab repository to Release. Seamless integration with your existing workflow.",
                },
                {
                  title: "Configure",
                  description:
                    "Set up your environment specifications. Customize to your project's needs.",
                },
                {
                  title: "Deploy",
                  description:
                    "Create ephemeral environments for each pull request. Accelerate your review process.",
                },
              ].map((step, index) => (
                <Card
                  key={`step-${index}`}
                  className="bg-gray-700 border-gray-600"
                >
                  <CardHeader>
                    <CardTitle className="text-white">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                Ready to Switch from GitLab?
              </h2>
              <p className="text-gray-400 md:text-xl">
                Join the growing number of companies choosing Release for better
                DevOps efficiency.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90"
                  >
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/book-a-demo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#00bb93] text-[#00bb93] hover:bg-[#00bb93] hover:text-white"
                  >
                    Schedule Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
