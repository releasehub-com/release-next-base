import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { ArrowRight, Cpu, Database, Globe, LineChart, Rocket, Server } from 'lucide-react'

export default function EphemeralUseCases() {
  return (
    <section id="use-cases" className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">Additional Ways to Use Release...</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="bg-gray-800 border-gray-700 hover:border-[#00bb93] transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Server className="mr-2 h-6 w-6 text-[#00bb93]" />
                Production Environment Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">Let Release manage production environments, enabling seamless scaling, monitoring, and deployment to ensure reliability and performance.</p>
              <Link href="https://docs.release.com/reference-documentation/workflows-in-release" className="flex items-center text-[#00bb93] hover:underline">
                <Rocket className="mr-2 h-5 w-5" />
                Production Deployment Strategies
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="https://docs.release.com/guides-and-examples/advanced-guides/visibility" className="flex items-center text-[#00bb93] hover:underline">
                <LineChart className="mr-2 h-5 w-5" />
                Monitoring and Observability
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700 hover:border-[#00bb93] transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="mr-2 h-6 w-6 text-[#00bb93]" />
                On-Premise Solutions with Release Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">Deliver and manage on-premise solutions using Release Delivery. Simplify deployments for customers who require private or VPC-hosted infrastructure with full control and security.</p>
              <Link href="https://release.com/product/release-delivery" className="flex items-center text-[#00bb93] hover:underline">
                <Database className="mr-2 h-5 w-5" />
                Learn More About Release Delivery
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700 hover:border-[#00bb93] transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Cpu className="mr-2 h-6 w-6 text-[#00bb93]" />
                AI Environments with Release.ai
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">Create scalable, ephemeral environments to support machine learning workflows, model training, and AI application testing. Streamline AI/ML development and deployment.</p>
              <Link href="https://release.ai" className="flex items-center text-[#00bb93] hover:underline">
                <Cpu className="mr-2 h-5 w-5" />
                Learn More About Release.ai
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
