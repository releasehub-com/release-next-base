'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckIcon, XIcon } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'

export default function KubernetesLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Header />
      
      <main className="flex-1">
        <section className="w-full py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Release: Simplify Your Kubernetes Management
                </h1>
                <p className="max-w-[600px] text-gray-400 md:text-xl">
                  Discover how Release automates and streamlines Kubernetes cluster management, allowing you to focus on application development rather than infrastructure maintenance.
                </p>
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
                    "Release has cut our deployment time by 75% and saved us $200k in DevOps costs annually."
                  </blockquote>
                  <div className="mt-4 flex items-center">
                    <Image
                      src="/DB-Logo_Blue-MD-AX8qss5c3JystqyyNzAiKzp0jO26bG.webp"
                      alt="DebtBook Logo"
                      width={60}
                      height={20}
                      className="mr-2"
                    />
                    <div>
                      <p className="font-semibold text-gray-100">Michael G.</p>
                      <p className="text-sm text-gray-400">Director of Infrastructure, DebtBook</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Automated Cluster Management",
                  description: "Release handles node autoscaling, Kubernetes version upgrades, and resource deployment automatically."
                },
                {
                  title: "Flexible Configuration",
                  description: "Use .release.yaml files to customize your application's build and deployment processes with ease."
                },
                {
                  title: "Streamlined Resource Management",
                  description: "Manage service resources efficiently with default configurations for CPU, memory, replicas, and storage."
                },
                {
                  title: "Advanced Autoscaling",
                  description: "Supports popular pod autoscaling solutions within the Kubernetes ecosystem for optimized performance."
                },
                {
                  title: "Cloud Integration",
                  description: "Release creates and manages Kubernetes clusters within your own cloud account for maximum control and security."
                },
                {
                  title: "Focus on Development",
                  description: "By abstracting Kubernetes complexities, Release allows you to concentrate on application development and deployment."
                }
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

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Why Choose Release for Kubernetes Management?</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Simplified Management",
                  description: "Release automates complex Kubernetes tasks, allowing you to focus on development rather than cluster management."
                },
                {
                  title: "Cost-Effective",
                  description: "Reduce the need for in-house Kubernetes expertise and optimize resource utilization with Release's efficient management."
                },
                {
                  title: "Faster Time-to-Market",
                  description: "Accelerate project launches with automated setup and configuration of Kubernetes environments."
                },
                {
                  title: "Automatic Scaling",
                  description: "Release manages node autoscaling and supports pod autoscaling solutions for optimal performance."
                },
                {
                  title: "Seamless Integration",
                  description: "Easily integrate with your existing tools and cloud infrastructure for a smooth workflow."
                },
                {
                  title: "Developer-Friendly",
                  description: "Release offers an intuitive interface for managing Kubernetes, making it accessible to developers of all skill levels."
                }
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

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              {[
                {
                  question: "How does Release simplify Kubernetes management?",
                  answer: "Release automates many complex tasks in Kubernetes management, such as cluster creation, node autoscaling, and version upgrades. It provides an intuitive interface and configuration options that allow developers to focus on application development rather than infrastructure maintenance."
                },
                {
                  question: "Can I customize my application's deployment with Release?",
                  answer: "Yes, Release uses a .release.yaml file where you can specify configurations like the Docker Compose file to use and directories containing raw Kubernetes manifests. This allows for flexible and customized deployment processes tailored to your application's needs."
                },
                {
                  question: "How does Release handle resource management?",
                  answer: "Release provides default configurations for CPU, memory, replicas, and storage, which can be easily overridden in the Application Template or for specific environments. This ensures efficient resource utilization across various scenarios while maintaining flexibility."
                },
                {
                  question: "Does Release support advanced Kubernetes features like autoscaling?",
                  answer: "Yes, Release supports popular pod autoscaling solutions within the Kubernetes ecosystem. While these may require additional configuration, Release can assist with their integration to optimize application performance under varying loads."
                }
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
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Ready to Simplify Your Kubernetes Management?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                Experience the power of Release and see how it can streamline your Kubernetes operations, allowing you to focus on building great applications.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="https://release.com/signup">
                  <Button size="lg" className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90">Start Free Trial</Button>
                </Link>
                <Link href="https://calendly.com/release-tommy/release-discussion">
                  <Button size="lg" variant="outline" className="border-[#00bb93] text-[#00bb93] hover:bg-[#00bb93] hover:text-white">Schedule Demo</Button>
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
