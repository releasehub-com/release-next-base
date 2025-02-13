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
import { CheckIcon, StarIcon, X } from "lucide-react";
import Header from "@/components/shared/layout/Header";
import Footer from "@/components/shared/layout/Footer";

export default function GitLabLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Header />

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
                    <CardTitle className="flex items-center text-white">
                      <span className="mr-2 bg-[#00bb93] text-white rounded-full w-8 h-8 flex items-center justify-center">
                        {index + 1}
                      </span>
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="https://release.com/signup">
                <Button
                  size="lg"
                  className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90"
                >
                  Get Started with Release
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">
              Why Choose Release Over GitLab?
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {[
                {
                  title: "Faster Development Cycles",
                  description:
                    "Release's ephemeral environments allow for quicker testing and deployment compared to GitLab's static environments.",
                },
                {
                  title: "Reduced Costs",
                  description:
                    "Our pay-per-use model and automated infrastructure management lead to significant savings over GitLab's fixed pricing.",
                },
                {
                  title: "Improved Team Productivity",
                  description:
                    "With Release, developers can focus on coding, not environment management, boosting overall team efficiency.",
                },
                {
                  title: "Enhanced Collaboration",
                  description:
                    "Instantly share environments with stakeholders, improving feedback and iteration cycles beyond GitLab's capabilities.",
                },
              ].map((benefit, index) => (
                <Card
                  key={`benefit-${index}`}
                  className="bg-gray-700 border-gray-600"
                >
                  <CardHeader>
                    <CardTitle className="text-white">
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">
              What Our Customers Say About Switching from GitLab
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  name: "Sarah L.",
                  role: "CTO, Datasaur",
                  content:
                    "Switching from GitLab to Release was a game-changer. Our deployment times decreased by 60%, and we've seen a significant boost in developer productivity.",
                },
                {
                  name: "Alex K.",
                  role: "Lead Developer, Together",
                  content:
                    "Release's ephemeral environments have revolutionized our testing process. We catch bugs faster and ship features more confidently than we ever did with GitLab.",
                },
                {
                  name: "Maria R.",
                  role: "DevOps Manager, Drata",
                  content:
                    "The cost savings with Release compared to GitLab are substantial. We've reduced our infrastructure costs by 40% while improving our deployment frequency.",
                },
              ].map((testimonial, index) => (
                <Card
                  key={`testimonial-${index}`}
                  className="bg-gray-700 border-gray-600"
                >
                  <CardHeader>
                    <CardTitle className="text-white">
                      {testimonial.name}
                    </CardTitle>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={`star-${i}`}
                          className="h-5 w-5 fill-current text-yellow-500"
                        />
                      ))}
                    </div>
                    <p className="italic text-gray-300">
                      "{testimonial.content}"
                    </p>
                  </CardContent>
                </Card>
              ))}
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
                    "How does Release compare to GitLab in terms of CI/CD capabilities?",
                  answer:
                    "Release offers superior CI/CD capabilities with its ephemeral environments for every pull request, automated infrastructure management, and faster deployment times. While GitLab provides CI/CD pipelines, Release takes it a step further by creating isolated environments for each change, enabling more efficient testing and review processes.",
                },
                {
                  question:
                    "Can I migrate my existing GitLab projects to Release?",
                  answer:
                    "Yes, Release is designed to integrate seamlessly with your existing GitLab repositories. Our platform provides tools and support to ensure a smooth transition, allowing you to leverage Release's advanced features while maintaining your current workflow.",
                },
                {
                  question:
                    "How much can I save by switching from GitLab to Release?",
                  answer:
                    "Customers typically save 40-60% on their DevOps costs by using Release, primarily through reduced infrastructure needs and more efficient resource utilization. The exact savings can vary based on your current GitLab setup and usage, but many companies report significant cost reductions.",
                },
                {
                  question:
                    "Does Release offer the same level of security as GitLab?",
                  answer:
                    "Release prioritizes security and offers robust measures that meet or exceed industry standards. We provide features such as role-based access control, audit logs, and encrypted data storage. Additionally, our ephemeral environments offer an added layer of security by isolating each development and testing instance.",
                },
              ].map((faq, index) => (
                <AccordionItem
                  key={`faq-${index}`}
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
                Ready to Upgrade from GitLab to Release?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                Join the companies that have accelerated their development and
                reduced costs by switching to Release. Experience the power of
                ephemeral environments and streamlined DevOps today.
              </p>
              <Link href="https://release.com/signup">
                <Button
                  size="lg"
                  className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90"
                >
                  Start Your Free Trial Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
