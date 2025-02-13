'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

export default function CloudDevHeroComponent() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 xl:py-24 bg-gray-900">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                Cloud Development Environments
              </h1>
              <p className="max-w-[600px] text-gray-300 md:text-xl">
                Harness the full power of cloud computing for your development needs. Build, test, and collaborate seamlessly with Release cloud development environments. Develop like it's running locally but get the full power of the cloud.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="https://release.com/signup">
                <Button size="lg" className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90">
                  Deploy a Cloud Dev Environment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://calendly.com/release-tommy/release-discussion">
                <Button size="lg" variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                  Schedule a Demo
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Image
              src="/blog-images/hero.svg"
              width={600}
              height={400}
              alt="Cloud Development Environment"
              className="rounded-xl object-cover"
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  )
}