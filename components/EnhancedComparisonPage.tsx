"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckIcon, XIcon, ArrowRightIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ComparisonPageProps {
  competitorName: string;
  features: {
    name: string;
    release: boolean;
    competitor: boolean;
    description: string;
  }[];
}

export function EnhancedComparisonPage({
  competitorName,
  features,
}: ComparisonPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-grow">
        <section className="py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-[#00bb93]">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Release vs {competitorName}
            </h1>
            <p className="text-xl mb-8">
              Experience the superior DevOps solution that outperforms{" "}
              {competitorName} in every aspect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="https://release.com/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#00bb93] text-white hover:bg-[#00bb93]/90 font-bold"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/book-a-demo">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-[#00bb93] hover:bg-gray-100 font-bold"
                >
                  Schedule a chat with a Release founder
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Why Release Outperforms {competitorName}
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`bg-gray-800 border-gray-700 overflow-hidden ${feature.release ? "ring-2 ring-[#00bb93]" : ""}`}
                >
                  <CardHeader
                    className={`${feature.release ? "bg-[#00bb93] text-white" : "bg-gray-700"}`}
                  >
                    <CardTitle className="flex items-center justify-between text-xl">
                      {feature.name}
                      {feature.release && <CheckIcon className="h-6 w-6" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="mt-4">
                    <p className="mb-4 text-gray-300">{feature.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <CheckIcon className="text-green-500 mr-2 h-5 w-5" />
                        <span className="font-semibold text-gray-200">
                          Release
                        </span>
                      </div>
                      <div className="flex items-center">
                        {feature.competitor ? (
                          <CheckIcon className="text-yellow-500 mr-2 h-5 w-5" />
                        ) : (
                          <XIcon className="text-red-500 mr-2 h-5 w-5" />
                        )}
                        <span className="text-gray-200">{competitorName}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Experience the Release Difference?
            </h2>
            <p className="text-xl mb-8">
              Join the companies that have accelerated their development and
              reduced costs with Release.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="https://release.com/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#00bb93] text-white hover:bg-[#00bb93]/90 font-bold"
                >
                  Start Your Free Trial{" "}
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/book-a-demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-[#00bb93] text-[#00bb93] hover:bg-[#00bb93] hover:text-white font-bold"
                >
                  Schedule a chat with a Release founder
                </Button>
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  question:
                    "How does Release compare to {competitorName} in terms of cost efficiency?",
                  answer:
                    "Release offers superior cost optimization through efficient resource management and comprehensive automation across all stages, often resulting in significant savings compared to {competitorName}.",
                },
                {
                  question:
                    "Can I easily migrate from {competitorName} to Release?",
                  answer:
                    "Yes, Release provides seamless migration tools and expert support to ensure a smooth transition from {competitorName}, minimizing disruption to your workflows.",
                },
                {
                  question:
                    "How does Release ensure better scalability than {competitorName}?",
                  answer:
                    "Release's architecture is designed for seamless scaling across all development stages, providing more flexibility and efficiency compared to {competitorName}'s approach.",
                },
                {
                  question: "What kind of support can I expect from Release?",
                  answer:
                    "Release offers comprehensive 24/7 support, including dedicated account managers, extensive documentation, and a responsive community, ensuring you have the assistance you need at every step.",
                },
              ].map((faq, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">
                      {faq.question.replace("{competitorName}", competitorName)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      {faq.answer.replace("{competitorName}", competitorName)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
