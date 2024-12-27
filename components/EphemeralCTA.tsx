'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function EphemeralCta() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
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
  )
}
