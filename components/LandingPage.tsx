'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckIcon, StarIcon } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'

export default function LandingPage() {
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
                    Faster, Cheaper DevOps. Happier Developers.
                  </h1>
                  <p className="max-w-[600px] text-gray-400 md:text-xl">
                    Accelerate your development workflow with Release. Create, manage, and scale Ephemeral environments in minutes. Empower your developers and reduce DevOps costs.
                  </p>
                </div>
                <ul className="grid gap-2 py-4">
                  <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" /> Ephemeral environments with every pull request</li>
                  <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" /> Automated infrastructure management</li>
                  <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" /> Seamless team collaboration</li>
                  <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" /> Significant cost savings</li>
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

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">Key Features of Release</h2>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
              {[
                { title: "Ephemeral Environments", description: (
                  <>
                    Spin up full-stack Ephemeral environments in minutes, not days. Accelerate your development process with Ephemeral, disposable environments. <Link href="https://ephemeral-environments.com" className="text-[#00bb93] hover:underline">Learn more about Ephemeral Environments</Link>.
                  </>
                )},
                { title: "Automated DevOps", description: "Let our platform handle the infrastructure management for you. Focus on coding, not configuration." },
                { title: "Team Collaboration", description: "Share environments instantly with your entire team. Improve communication and productivity." },
                { title: "Cost Optimization", description: "Pay only for what you use, scale as you grow. Reduce infrastructure and personnel costs." },
                { title: "Reproducible AI Environments", description: (
                  <>
                    Create secure and consistent AI environments on-demand. Streamline your AI development workflow with Release.ai. <Link href="https://release.ai" className="text-[#00bb93] hover:underline">Learn More about Release.ai</Link>
                  </>
                )},
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

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">How Release Works</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                { title: "Connect", description: "Link your Git repository to Release. Seamless integration with your existing workflow." },
                { title: "Configure", description: "Set up your environment specifications. Customize to your project's needs." },
                { title: "Deploy", description: "Create Ephemeral environments for each pull request. Accelerate your review process." },
              ].map((step, index) => (
                <Card key={index} className="bg-gray-700 border-gray-600">
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
                <Button size="lg" className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90">Get Started with Release</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">Reproducible AI Environments</h2>
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Streamline Your AI Development</h3>
                <p className="text-lg text-gray-300 mb-6">
                  Release.ai offers reproducible and secure AI environments on-demand, paralleling our approach to general development environments. Simplify your AI workflow and focus on innovation.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center"><CheckIcon className="mr-2 h-5 w-5 text-[#00bb93]" /> Instant AI-ready environments</li>
                  <li className="flex items-center"><CheckIcon className="mr-2 h-5 w-5 text-[#00bb93]" /> Support for popular AI frameworks and tools</li>
                  <li className="flex items-center"><CheckIcon className="mr-2 h-5 w-5 text-[#00bb93]" /> Seamless integration with your existing workflow</li>
                  <li className="flex items-center"><CheckIcon className="mr-2 h-5 w-5  text-[#00bb93]" /> Scalable infrastructure for AI projects</li>
                </ul>
                <p className="mt-4 mb-6">
                  <Link href="https://release.ai">
                    <Button size="lg" className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90">Explore Release.ai</Button>
                  </Link>
                </p>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/releaseaiimage-cHfK2RLJZ8CGCjoAhDcfbCt4lTz10d.webp"
                  alt="Release.ai Interface"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">Why Choose Release for Your Development Workflow?</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {[
                { title: "Faster Development Cycles", description: "Reduce time from code to production significantly. Ship features faster with Release." },
                { title: "Reduced Costs", description: "Save on infrastructure and personnel costs. Optimize your DevOps spending." },
                { title: "Improved Team Productivity", description: "Let developers focus on coding, not environment management. Boost your team's efficiency." },
                { title: "Enhanced Collaboration", description: "Share environments instantly with stakeholders. Improve feedback and iteration cycles." },
              ].map((benefit, index) => (
                <Card key={index} className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white">{benefit.title}</CardTitle>
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
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">What Our Customers Say About Release</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  name: "Lilith C.",
                  role: "Staff Software Engineer, DebtBook",
                  content: "Within 10 minutes of pushing up a commit I have an environment link for others to see my work. Today a ticket from creation to completely reviewed/tested and merged takes < 2 hours. A year ago that would have taken days.",
                },
                {
                  name: "Ivan L.",
                  role: "CEO, Datasaur",
                  content: "Release has enabled us to move quickly and deliver higher quality solutions. Instead of building an environment platform ourselves, we've focused on our application and scaled rapidly without sacrificing capabilities. They've been an invaluable partner in our growth.",
                },
                {
                  name: "Emily R.",
                  role: "Product Manager, HealthTech Innovations",
                  content: "Our team collaboration has never been better. Sharing environments is now a breeze with Release.",
                },
              ].map((testimonial, index) => (
                <Card key={index} className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white">{testimonial.name}</CardTitle>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="h-5 w-5 fill-current text-yellow-500" />
                      ))}
                    </div>
                    <p className="italic text-gray-300">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">Frequently Asked Questions About Release</h2>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              {[
                {
                  question: "How does Release work?",
                  answer: "Release integrates with your Git repository and automatically creates on-demand environments for each pull request. It handles the infrastructure setup, allowing your team to focus on development. This streamlines your workflow and accelerates your development process.",
                },
                {
                  question: "Is Release secure?",
                  answer: "Yes, Release employs industry-standard security measures, including data encryption, regular security audits, and compliance with major security standards. We prioritize the safety and integrity of your code and data.",
                },
                {
                  question: "How much can I save by using Release?",
                  answer: "Customers typically save 40-60% on their DevOps costs by using Release, primarily through reduced personnel needs and more efficient resource utilization. The exact savings can vary based on your current setup and needs.",
                },
                {
                  question: "Can Release integrate with my existing tools?",
                  answer: "Release integrates seamlessly with popular tools like GitHub, GitLab, Bitbucket, Kubernetes, and Terraform, among others. This allows you to incorporate Release into your existing workflow with minimal disruption.",
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
                Ready to Transform Your Development Process with Release?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                Join the companies that have accelerated their development and reduced costs with Release. Experience the power of Ephemeral environments today.
              </p>
              <Link href="https://calendly.com/release-tommy/release-discussion">
                <Button size="lg" className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90">Start Your Free Trial with Release Now</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
