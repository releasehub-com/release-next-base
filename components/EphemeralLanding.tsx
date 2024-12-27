'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { CheckIcon } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EphemeralEnvironments() {
  const testimonials = [
    {
      company: "DebtBook",
      logo: "/placeholder-logo.svg",
      quote: "Accelerated our shipping process by six times, significantly enhancing development velocity.",
    },
    {
      company: "Chipper Cash",
      logo: "/placeholder-logo.svg",
      quote: "Reduced testing time from approximately 24 hours to about 5 minutes, streamlining QA processes.",
    },
    {
      company: "Noteable",
      logo: "/placeholder-logo.svg",
      quote: "Increased collaboration and development velocity while cutting downtime by 50%, leading to more efficient workflows.",
    },
    {
      company: "Mosaic",
      logo: "/placeholder-logo.svg",
      quote: "Built tailored solutions for residential developers, enabling seamless creation of customized environments.",
    },
    {
      company: "Datasaur.ai",
      logo: "/placeholder-logo.svg",
      quote: "Replicated complex environments easily, ensuring consistency across development and production stages.",
    },
    {
      company: "Simon Data",
      logo: "/placeholder-logo.svg",
      quote: "Implemented pre-production ephemeral environments and sales demo environments, enhancing testing and demonstration capabilities.",
    },
    {
      company: "Monad",
      logo: "/placeholder-logo.svg",
      quote: "Simplified managing B2B SaaS on-premise/VPC environments, making deployments more straightforward and efficient.",
    },
  ]

  const companyLogos = [
    { url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/65e7478b28c49416c60a3e84_Brand-DebtBook-320x80.svg", alt: "DebtBook" },
    { url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c066c487c5eeace1b89_Brand-Ethos.svg", alt: "Ethos" },
    { url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c0620464b59da2d3fc6_Brand-Navan.svg", alt: "Navan" },
    { url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c069d028b16c1837425_Brand-Chipper.svg", alt: "Chipper" },
    { url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c04d4b1a7b780ee98e1_Brand-dispatch_health.svg", alt: "Dispatch Health" },
    { url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c0485d1049635456984_Brand-Simon.svg", alt: "Simon" },
    { url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c03b7222b7bd919a8ae_Brand-Together.svg", alt: "Together" },
    { url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c03f440994e9112f8ef_Brand-Datasaur-ai.svg", alt: "Datasaur.ai" },
    { url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/6408b77931ea2bc3a4c2df13_Brand-simplyInsured-280x70.svg", alt: "Simply Insured" },
  ]


  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Header />
      
      <main className="flex-1">
        <section className="w-full py-6 md:py-10 lg:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2 items-start">
              <div className="flex flex-col justify-start space-y-6">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                  The Industry Leading Self-Service Ephemeral Environments Platform
                </h1>
                <p className="text-xl text-gray-400">
                  <span className="font-semibold text-gray-300">Faster, cheaper DevOps. Happier developers.</span> Create and manage ephemeral environments in minutes.
                </p>
                <ul className="grid gap-3">
                  <li className="flex items-center"><CheckIcon className="mr-2 h-5 w-5 text-[#00bb93]" /> Ephemeral environments with every pull request</li>
                  <li className="flex items-center"><CheckIcon className="mr-2 h-5 w-5 text-[#00bb93]" /> Automated infrastructure management</li>
                  <li className="flex items-center"><CheckIcon className="mr-2 h-5 w-5 text-[#00bb93]" /> Seamless team collaboration</li>
                  <li className="flex items-center"><CheckIcon className="mr-2 h-5 w-5 text-[#00bb93]" /> Significant cost savings</li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Link href="https://release.com/signup">
                    <Button size="lg" className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90">Start Free Trial</Button>
                  </Link>
                  <Link href="https://calendly.com/release-tommy/release-discussion">
                    <Button size="lg" variant="outline" className="border-[#00bb93] text-[#00bb93] hover:bg-[#00bb93] hover:text-white">Schedule Demo</Button>
                  </Link>
                </div>
              </div>
              <div className="relative mt-0">
                <div className="hidden lg:block rounded-lg overflow-hidden shadow-2xl max-w-xl mx-auto mt-0">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hero-j5v7Dsp7tvFQegF88l27KygDD0LKYb.png"
                    alt="Release platform interface showing deployment status"
                    width={900}
                    height={600}
                    className="w-full h-auto"
                    priority
                  />
                </div>
                <div className="mt-6 bg-gray-800 p-6 rounded-lg">
                  <blockquote className="text-lg font-semibold text-gray-100">
                    "Release has cut our deployment time by 75% and saved us $200k in DevOps costs annually."
                  </blockquote>
                  <div className="mt-4 flex items-center">
                    <Image
                      src="/DB-Logo_Blue-MD-AX8qss5c3JystqyyNzAiKzp0jO26bG.webp"
                      alt="DebtBook Logo"
                      width={60}
                      height={20}
                      className="mr-3"
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

        <section className="w-full py-12 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-100">The Most Innovative Companies Use Release</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {companyLogos.map((logo, index) => (
                <div key={index} className="flex justify-center items-center">
                  <Image
                    src={logo.url}
                    alt={logo.alt}
                    width={240}
                    height={60}
                    className="h-12 w-auto object-contain"
                    style={{ filter: 'url(#white-filter)' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">Key Features of Release</h2>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {[
                { title: "Automated Review Environments", description: "Generate full-stack environments for every pull request, enabling comprehensive CI and end-to-end tests." },
                { title: "Developer Empowerment", description: "Provision environments automatically upon code push using GitOps integration, providing secure, shareable links for team collaboration." },
                { title: "Remote Development Environments", description: "Offer remote development environments that can be 'mounted' to a developer's local computer, facilitating seamless development workflows." },
                { title: "Accelerated Iteration", description: "Eliminate dependencies on traditional staging deployments, allowing teams to identify and address issues earlier in the development process." },
                { title: "Cost Efficiency", description: "Provide on-demand environments that scale to zero when inactive, resulting in significant reductions in pre-production cloud costs, with savings ranging from 30-70%." },
                { title: "Instant Datasets", description: "Utilize Release's Instant Datasets to create and manage realistic datasets for testing and development, enabling data-driven testing and replication of production-like scenarios." },
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

        <section id="integration" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">Seamless Integration and Workflow</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Integrate with Your Existing Tools</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center"><CheckIcon className="mr-2 h-5 w-5 text-[#00bb93]" /> CI/CD pipeline integration with all major providers</li>
                  <li className="flex items-center"><CheckIcon className="mr-2 h-5 w-5 text-[#00bb93]" /> Docker Compose and Kubernetes compatibility</li>
                  <li className="flex items-center"><CheckIcon className="mr-2 h-5 w-5 text-[#00bb93]" /> Helm charts and Terraform support</li>
                  <li className="flex items-center"><CheckIcon className="mr-2 h-5 w-5 text-[#00bb93]" /> Major cloud provider integration</li>
                  <li className="flex items-center"><CheckIcon className="mr-2 h-5 w-5 text-[#00bb93]" /> Secure secrets management</li>
                  <li className="flex items-center"><CheckIcon className="mr-2 h-5 w-5 text-[#00bb93]" /> Static JavaScript generation support</li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/63bffa91cfbc6c0ad32aba03_template-multi-repo-2.svg"
                  alt="Integration Workflow"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="use-cases" className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">Additional Ways to Use Release...</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Production Environment Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Let Release manage production environments, enabling seamless scaling, monitoring, and deployment to ensure reliability and performance.</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">On-Premise Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Deliver and manage on-premise solutions using Release Delivery. Simplify deployments for customers who require private or VPC-hosted infrastructure with full control and security.</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">AI Environments with Release.ai</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Create scalable, ephemeral environments to support machine learning workflows, model training, and AI application testing. Streamline AI/ML development and deployment.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">Customer Success Stories</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Image
                        src={testimonial.logo}
                        alt={`${testimonial.company} logo`}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <CardTitle className="text-white">{testimonial.company}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">&quot;{testimonial.quote}&quot;</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                Ready to Transform Your Development Process?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                Join the companies that have accelerated their development and reduced costs with Release's Ephemeral Environments Platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
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
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter id="white-filter">
              <feColorMatrix type="matrix" values="1 0 0 0 1  1 0 0 0 1  1 0 0 0 1  0 0 0 1 0" />
            </filter>
          </defs>
        </svg>
      </main>

      <Footer />
    </div>
  )
}
