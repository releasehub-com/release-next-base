'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckIcon, XIcon, StarIcon } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'

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
                    Release Delivery vs. Replicated: Beyond On-Premise
                  </h1>
                  <p className="max-w-[600px] text-gray-400 md:text-xl">
                    Experience the future of software delivery across all environments. Release Delivery offers a comprehensive approach to building, testing, and deploying complex applications—quickly, securely, and at scale.
                  </p>
                </div>
                <ul className="grid gap-2 py-4">
                  <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" /> Cloud-native and multi-environment testing</li>
                  <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" /> Rapid setup and automated workflows</li>
                  <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" /> Intuitive UI and GitOps-driven processes</li>
                  <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" /> Built-in security best practices</li>
                </ul>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="https://release.com/signup">
                    <Button size="lg" className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90">Start Free Trial</Button>
                  </Link>
                  <Link href="https://calendly.com/release-tommy/release-discussion">
                    <Button size="lg" variant="outline" className="border-[#00bb93] text-[#00bb93] hover:bg-[#00bb93] hover:text-white">Schedule Demo</Button>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <blockquote className="text-lg font-semibold text-gray-100">
                    "Switching from Replicated to Release Delivery transformed our release pipeline. We're now delivering quality features to customers in record time."
                  </blockquote>
                  <div className="mt-4 flex items-center">
                    <div>
                      <p className="font-semibold text-gray-100">Head of DevOps</p>
                      <p className="text-sm text-gray-400">Enterprise Tech Company</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="comparison" className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">Release Delivery vs. Replicated: Key Differences</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-[#00bb93]">Release Delivery</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><CheckIcon className="inline-block mr-2 text-[#00bb93]" />Cloud-native and multi-environment testing</p>
                  <p><CheckIcon className="inline-block mr-2 text-[#00bb93]" />Rapid setup and automated workflows</p>
                  <p><CheckIcon className="inline-block mr-2 text-[#00bb93]" />Intuitive UI and GitOps-driven processes</p>
                  <p><CheckIcon className="inline-block mr-2 text-[#00bb93]" />Built-in security best practices</p>
                  <p><CheckIcon className="inline-block mr-2 text-[#00bb93]" />Seamless scalability</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-400">Replicated</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><CheckIcon className="inline-block mr-2 text-gray-400" />Primarily on-prem & enterprise Kubernetes</p>
                  <p><XIcon className="inline-block mr-2 text-red-500" />Longer onboarding, complex configurations</p>
                  <p><XIcon className="inline-block mr-2 text-red-500" />Heavier reliance on manual ops and scripting</p>
                  <p><XIcon className="inline-block mr-2 text-red-500" />Complex compliance requirements on-prem</p>
                  <p><XIcon className="inline-block mr-2 text-red-500" />More rigid, infrastructure-heavy approach</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">Why Choose Release Delivery Over Replicated?</h2>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {[
                { title: "Faster Time-to-Market", description: "Go from code commit to fully tested and deployed environment in minutes, not days. Ship features faster than ever with automated workflows and self-service test environments." },
                { title: "Streamlined Developer Experience", description: "Enjoy a clean, intuitive interface paired with GitOps-driven automation. Eliminate manual scripting and reduce human error, allowing your team to focus on innovation." },
                { title: "Built-in Security & Compliance", description: "Incorporate security best practices directly into your delivery pipeline. Ensure your code is secure, compliant, and resilient without additional tooling or expertise." },
                { title: "True Cloud-Native Scalability", description: "Scale effortlessly as your applications and teams grow. Maintain speed and reliability without extensive infrastructure adjustments." },
                { title: "End-to-End Observability & Control", description: "Gain complete visibility and control over your environments. Monitor performance, pinpoint issues, and instantly roll back problematic deployments with ease." },
                { title: "Beyond On-Premise", description: "While excelling in on-premise deployments, Release Delivery offers a comprehensive approach for cloud-native and multi-environment applications, providing flexibility for all your deployment needs." },
              ].map((feature, index) => (
                <Card key={index} className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
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
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">Customer Success Stories</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-6">
                  <p className="text-lg mb-4">"Release Delivery helped us cut deployment time by 75%, enabling our team to focus on innovation rather than infrastructure."</p>
                  <p className="font-bold text-[#00bb93]">— CTO, Growing SaaS Startup</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-6">
                  <p className="text-lg mb-4">"Switching from Replicated to Release Delivery transformed our release pipeline. We're now delivering quality features to customers in record time."</p>
                  <p className="font-bold text-[#00bb93]">— Head of DevOps, Enterprise Tech Company</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              {[
                {
                  question: "How does Release Delivery differ from Replicated?",
                  answer: "While Replicated focuses primarily on on-premises and enterprise Kubernetes deployments, Release Delivery offers a more comprehensive approach. It supports cloud-native and multi-environment testing, provides faster setup and automated workflows, and offers built-in security best practices. Release Delivery is designed to streamline your entire software delivery process, from development to deployment, across various environments.",
                },
                {
                  question: "Can Release Delivery handle on-premise deployments like Replicated?",
                  answer: "Yes, Release Delivery can handle on-premise deployments, but it goes beyond that. It offers a flexible approach that supports both on-premise and cloud environments, allowing you to manage your deployments across various infrastructures from a single platform. This versatility makes Release Delivery suitable for a wider range of deployment scenarios compared to Replicated.",
                },
                {
                  question: "How does Release Delivery improve time-to-market compared to Replicated?",
                  answer: "Release Delivery significantly reduces time-to-market through its automated workflows, self-service environments, and streamlined processes. While Replicated often requires more hands-on configuration and time-consuming processes, Release Delivery allows you to go from code commit to a fully tested and deployed environment in minutes, accelerating your entire development and deployment cycle.",
                },
                {
                  question: "Is it difficult to switch from Replicated to Release Delivery?",
                  answer: "Switching from Replicated to Release Delivery is designed to be as smooth as possible. Our team provides comprehensive support during the transition, including migration assistance, training, and ongoing technical support. Many of our customers have successfully made the switch and seen significant improvements in their development and deployment processes.",
                },
              ].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-gray-300">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-300">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                Ready to Experience the Release Delivery Difference?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                Join the companies that have accelerated their development and reduced costs by switching from Replicated to Release Delivery. Experience the power of true multi-environment deployment today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="https://release.com/signup">
                  <Button size="lg" className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90">Start Your Free Trial</Button>
                </Link>
                <Link href="https://calendly.com/release-tommy/release-discussion">
                  <Button size="lg" variant="outline" className="border-[#00bb93] text-[#00bb93] hover:bg-[#00bb93] hover:text-white">Schedule a Demo</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
