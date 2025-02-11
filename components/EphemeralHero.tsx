"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

export default function EphemeralHeroComponent() {
  return (
    <section className="w-full py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                The Industry Leading Ephemeral Environment Self-Service Platform
              </h1>
              <p className="max-w-[600px] text-gray-400 md:text-xl">
                Faster, cheaper DevOps. Happier developers. Create and manage
                ephemeral environments in minutes.
              </p>
            </div>
            <ul className="grid gap-2 py-4">
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" /> Ephemeral
                environments with every pull request
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" /> Automated
                infrastructure management
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" /> Seamless
                team collaboration
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-4 w-4 text-[#00bb93]" />{" "}
                Significant cost savings
              </li>
            </ul>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/book-a-demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#00bb93] text-[#00bb93] hover:bg-[#00bb93] hover:text-white"
                >
                  Schedule Demo
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
                height={600}
                className="w-full h-auto"
                unoptimized
              />
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <blockquote className="text-lg font-semibold text-gray-100">
                "Release has cut our deployment time by 75% and saved us $200k
                in DevOps costs annually."
              </blockquote>
              <div className="mt-4 flex items-center">
                <Image
                  src="/blog-images/DB-Logo_Blue-MD-AX8qss5c3JystqyyNzAiKzp0jO26bG.webp"
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
