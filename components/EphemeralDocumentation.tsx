'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Search, FileCheck, MessageSquare } from 'lucide-react'

export default function EphemeralDocumentation() {
  return (
    <section id="documentation-support" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white mb-4">
            Documentation That Actually Helps, with a Dedicated Team on Slack
          </h2>
          <p className="text-xl text-gray-300">
            We've made a massive investment in building world-class developer documentation and support. Built by developers, for developers. Everything you need to succeed with Release.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="relative">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-16 bg-[#00bb93] rounded-full" />
              <div className="pl-6">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                  <BookOpen className="mr-3 h-6 w-6 text-[#00bb93]" />
                  Comprehensive Documentation
                </h3>
                <p className="text-gray-300">
                  Our documentation covers every feature, providing detailed instructions and examples for configuring and managing environments.
                </p>
                <Link 
                  href="https://docs.release.com" 
                  className="inline-flex items-center mt-2 text-[#00bb93] hover:text-[#00bb93]/80"
                >
                  Explore documentation
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-16 bg-[#00bb93] rounded-full" />
              <div className="pl-6">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                  <Search className="mr-3 h-6 w-6 text-[#00bb93]" />
                  AI-Powered Search Engine
                </h3>
                <p className="text-gray-300">
                  Easily find answers using our AI-powered search engine, which allows users to ask questions and quickly locate solutions to common challenges.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-16 bg-[#00bb93] rounded-full" />
              <div className="pl-6">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                  <FileCheck className="mr-3 h-6 w-6 text-[#00bb93]" />
                  Tested Documentation
                </h3>
                <p className="text-gray-300">
                  Every new feature we build is released alongside tested documentation, ensuring reliability and clarity for all users.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-16 bg-[#00bb93] rounded-full" />
              <div className="pl-6">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                  <MessageSquare className="mr-3 h-6 w-6 text-[#00bb93]" />
                  Dedicated Support Channels
                </h3>
                <p className="text-gray-300">
                  Every customer gets a dedicated Slack channel directly connected to our engineers. It's like having a team of Senior DevOps Engineers at your disposal to help solve any issue you encounter.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:pl-12">
            <div className="bg-gray-800 rounded-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00bb93]/10 blur-3xl rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <h3 className="text-2xl font-bold text-white mb-6">Developer Resources</h3>
                <div className="space-y-6">
                  <Card className="bg-gray-700/50 border-gray-600">
                    <CardContent className="pt-6">
                      <div className="flex items-start">
                        <div className="bg-[#00bb93]/10 p-3 rounded-lg">
                          <BookOpen className="h-6 w-6 text-[#00bb93]" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-white">Getting Started Guide</h4>
                          <p className="text-sm text-gray-400">Step-by-step guide to set up your first environment</p>
                          <Link href="https://docs.release.com/getting-started/quickstart">
                            <Button variant="link" className="mt-2 text-[#00bb93] p-0 h-auto">View Guide</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-700/50 border-gray-600">
                    <CardContent className="pt-6">
                      <div className="flex items-start">
                        <div className="bg-[#00bb93]/10 p-3 rounded-lg">
                          <Search className="h-6 w-6 text-[#00bb93]" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-white">AI Powered Documentation Search</h4>
                          <p className="text-sm text-gray-400">Intelligent search through our documentation</p>
                          <Link href="https://docs.release.com/?q=">
                            <Button variant="link" className="mt-2 text-[#00bb93] p-0 h-auto">Try Search</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-700/50 border-gray-600">
                    <CardContent className="pt-6">
                      <div className="flex items-start">
                        <div className="bg-[#00bb93]/10 p-3 rounded-lg">
                          <FileCheck className="h-6 w-6 text-[#00bb93]" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-white">Hundreds of Working Examples</h4>
                          <p className="text-sm text-gray-400">Explore our collection of real-world examples</p>
                          <Link href="https://github.com/awesome-release">
                            <Button variant="link" className="mt-2 text-[#00bb93] p-0 h-auto">View Examples</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8">
                  <p className="text-gray-300 mb-6">
                    With these tools and resources, adopting and scaling Release is faster and easier than ever.
                  </p>
                  <Button className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90 w-full">
                    <Link href="https://docs.release.com">
                      View Documentation
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
