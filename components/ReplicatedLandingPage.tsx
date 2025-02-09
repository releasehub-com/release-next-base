"use client";

import React from "react";
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
import { CheckIcon, XIcon, StarIcon } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

export function ReleaseVsReplicated() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Header />

      <main className="flex-1">
        <section className="w-full py-8 md:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                    Release Delivery: Superior On-Premise Solutions and Beyond
                  </h1>
                  <p className="max-w-[600px] text-gray-400 md:text-xl">
                    Experience unparalleled on-premise deployments and seamless
                    multi-environment management. Release Delivery outperforms
                    Replicated in every aspect of software delivery—on-premise,
                    cloud, and hybrid.
                  </p>
                </div>
                <ul className="grid gap-2 py-4">
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" />{" "}
                    Advanced on-premise deployment capabilities
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" />{" "}
                    Seamless integration with existing infrastructure
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" />{" "}
                    Enhanced security and compliance for on-premise environments
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" />{" "}
                    Unified platform for on-premise, cloud, and hybrid
                    deployments
                  </li>
                </ul>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="https://release.com/signup">
                    <Button
                      size="lg"
                      className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90"
                    >
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link href="https://calendly.com/release-tommy/release-discussion">
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
                    "Release Delivery revolutionized our on-premise deployments.
                    We achieved levels of efficiency and security that were
                    simply impossible with Replicated."
                  </blockquote>
                  <div className="mt-4 flex items-center">
                    <div>
                      <p className="font-semibold text-gray-100">CTO</p>
                      <p className="text-sm text-gray-400">
                        Fortune 500 Financial Services Company
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="comparison"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-800"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">
              Release Delivery vs. Replicated: On-Premise Excellence
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-[#00bb93]">
                    Release Delivery
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <CheckIcon className="inline-block mr-2 text-[#00bb93]" />
                    Superior on-premise deployment capabilities
                  </p>
                  <p>
                    <CheckIcon className="inline-block mr-2 text-[#00bb93]" />
                    Automated on-premise infrastructure management
                  </p>
                  <p>
                    <CheckIcon className="inline-block mr-2 text-[#00bb93]" />
                    Enhanced security features for sensitive environments
                  </p>
                  <p>
                    <CheckIcon className="inline-block mr-2 text-[#00bb93]" />
                    Seamless integration with existing on-premise tools
                  </p>
                  <p>
                    <CheckIcon className="inline-block mr-2 text-[#00bb93]" />
                    Unified platform for on-premise and cloud deployments
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-400">
                    Replicated
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <CheckIcon className="inline-block mr-2 text-gray-400" />
                    Basic on-premise deployment support
                  </p>
                  <p>
                    <XIcon className="inline-block mr-2 text-red-500" />
                    Limited automation for on-premise infrastructure
                  </p>
                  <p>
                    <XIcon className="inline-block mr-2 text-red-500" />
                    Standard security features
                  </p>
                  <p>
                    <XIcon className="inline-block mr-2 text-red-500" />
                    Complex integration with existing tools
                  </p>
                  <p>
                    <XIcon className="inline-block mr-2 text-red-500" />
                    Primarily focused on on-premise, limited cloud support
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">
              Why Release Delivery Excels in On-Premise Deployments
            </h2>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {[
                {
                  title: "Advanced Infrastructure Management",
                  description:
                    "Automate and optimize your on-premise infrastructure with Release Delivery's intelligent management system. Reduce manual overhead and improve resource utilization.",
                },
                {
                  title: "Enhanced Security and Compliance",
                  description:
                    "Meet the strictest security requirements with Release Delivery's advanced on-premise security features. Ensure compliance with industry standards and regulations effortlessly.",
                },
                {
                  title: "Seamless Integration",
                  description:
                    "Easily integrate Release Delivery with your existing on-premise tools and workflows. Minimize disruption and maximize the value of your current investments.",
                },
                {
                  title: "Scalability Within Your Firewall",
                  description:
                    "Scale your on-premise deployments with the same ease as cloud deployments. Release Delivery brings cloud-like scalability to your secure, on-premise environments.",
                },
                {
                  title: "Unified Management",
                  description:
                    "Manage all your deployments—on-premise, cloud, and hybrid—from a single, intuitive platform. Simplify operations and reduce complexity across your entire infrastructure.",
                },
                {
                  title: "Performance Optimization",
                  description:
                    "Leverage Release Delivery's advanced analytics and optimization tools to ensure peak performance of your on-premise applications, surpassing Replicated's capabilities.",
                },
              ].map((feature, index) => (
                <Card key={index} className="bg-gray-700 border-gray-600">
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

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">
              On-Premise Success Stories
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-6">
                  <p className="text-lg mb-4">
                    "Release Delivery's on-premise capabilities far exceed what
                    we experienced with Replicated. Our deployment times
                    decreased by 80%, and our security posture significantly
                    improved."
                  </p>
                  <p className="font-bold text-[#00bb93]">
                    — CISO, Global Manufacturing Corporation
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-6">
                  <p className="text-lg mb-4">
                    "The seamless integration of Release Delivery with our
                    existing on-premise infrastructure was a game-changer. We
                    achieved levels of efficiency and control that were simply
                    not possible with Replicated."
                  </p>
                  <p className="font-bold text-[#00bb93]">
                    — VP of Engineering, Healthcare Technology Provider
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">
              Frequently Asked Questions
            </h2>
            <Accordion
              type="single"
              collapsible
              className="w-full max-w-3xl mx-auto"
            >
              {[
                {
                  question:
                    "How does Release Delivery's on-premise solution compare to Replicated?",
                  answer:
                    "Release Delivery offers superior on-premise capabilities compared to Replicated. Our solution provides advanced automation, enhanced security features, and seamless integration with existing tools, all while maintaining the flexibility to manage cloud and hybrid deployments from the same platform. This comprehensive approach allows for more efficient, secure, and scalable on-premise deployments than what Replicated can offer.",
                },
                {
                  question:
                    "Can Release Delivery handle complex on-premise environments better than Replicated?",
                  answer:
                    "Absolutely. Release Delivery is designed to excel in complex on-premise environments. Our platform offers advanced infrastructure management, superior security controls, and seamless integration capabilities that surpass Replicated's offerings. This allows us to handle even the most intricate on-premise setups with ease, providing a level of control and efficiency that Replicated simply can't match.",
                },
                {
                  question:
                    "How does Release Delivery improve on-premise deployment times compared to Replicated?",
                  answer:
                    "Release Delivery significantly reduces on-premise deployment times through its advanced automation and optimized workflows. While Replicated often requires more manual configuration, Release Delivery's intelligent system can automatically handle many aspects of the deployment process. Our customers regularly report deployment time reductions of 70-80% compared to their previous experiences with Replicated.",
                },
                {
                  question:
                    "Is it difficult to switch from Replicated to Release Delivery for on-premise deployments?",
                  answer:
                    "Transitioning from Replicated to Release Delivery is designed to be as smooth as possible, even for complex on-premise deployments. Our team provides comprehensive support during the migration, including detailed infrastructure assessment, customized migration plans, and hands-on assistance. Many of our customers have successfully made the switch and seen significant improvements in their on-premise deployment processes, often completing the transition more quickly and with less disruption than they anticipated.",
                },
              ].map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-gray-700"
                >
                  <AccordionTrigger className="text-white hover:text-gray-300">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                Ready to Elevate Your On-Premise Deployments?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                Join the companies that have transformed their on-premise
                infrastructure with Release Delivery. Experience superior
                deployments, enhanced security, and unparalleled efficiency
                today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="https://release.com/signup">
                  <Button
                    size="lg"
                    className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90"
                  >
                    Start Your Free Trial
                  </Button>
                </Link>
                <Link href="https://calendly.com/release-tommy/release-discussion">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#00bb93] text-[#00bb93] hover:bg-[#00bb93] hover:text-white"
                  >
                    Schedule a Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ReleaseVsReplicated;
