'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function CloudDevCTA() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-[#00bb93]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
            Ready to Elevate Your Development Workflow?
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-100 md:text-xl">
            Experience the power of cloud development environments with Release. Start coding in the cloud today.
          </p>
          <Link href="https://release.com/signup">
            <Button size="lg" className="bg-white text-[#00bb93] hover:bg-gray-100">
              Deploy a Cloud Dev Environment
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}