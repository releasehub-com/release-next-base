"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

export default function CloudHeroComponent() {
  return (
    <section className="w-full py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="px-3 py-1 text-sm bg-[#00bb93]/10 text-[#00bb93] rounded-full">
                  Heroku Alternative
                </span>
                <span className="px-3 py-1 text-sm bg-[#00bb93]/10 text-[#00bb93] rounded-full">
                  Cloud Native
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                Modern Cloud Platform for Growing Teams
              </h1>
              <p className="max-w-[600px] text-gray-400 md:text-xl">
                Start with a Heroku-like experience, then seamlessly scale to
                enterprise-grade infrastructure in your own cloud.
              </p>
            </div>
            <ul className="grid gap-2 py-4">
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" /> Simple
                deployment with git push
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" /> Scale from
                hosted to your own cloud
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" /> Full cloud
                provider capabilities
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" /> No vendor
                lock-in
              </li>
            </ul>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="https://release.com/signup">
                <Button
                  size="lg"
                  className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90"
                >
                  Start Free on Release Cloud
                </Button>
              </Link>
              <Link href="https://calendly.com/release-tommy/release-discussion-release-cloud">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#00bb93] text-[#00bb93] hover:bg-[#00bb93] hover:text-white"
                >
                  Book a Demo
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-6">
            <div className="relative rounded-lg overflow-hidden shadow-xl bg-gray-800">
              <Image
                src="/blog-images/hero.svg"
                alt="Release platform interface"
                width={800}
                height={500}
                className="w-full h-auto"
                priority
              />
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <blockquote className="text-lg font-semibold text-gray-100">
                "Release gives us Heroku's simplicity with the power of AWS.
                Perfect as we scaled from startup to enterprise."
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
                  <p className="text-sm text-gray-400">
                    Director of Infrastructure, DebtBook
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
