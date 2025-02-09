"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#00bb93]">ABOUT</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://release.com/company"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Our Company
                </Link>
              </li>
              <li>
                <Link
                  href="https://release.com/press-releases"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Press Releases
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#00bb93]">
              PRODUCTS
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://release.com/product/instant-datasets"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Instant Datasets
                </Link>
              </li>
              <li>
                <Link
                  href="https://release.com/product/release-delivery"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Release Delivery
                </Link>
              </li>
              <li>
                <Link
                  href="https://release.com/get-started"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Environments as a Service
                </Link>
              </li>
              <li>
                <Link
                  href="https://release.com/pricing"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#00bb93]">
              WHY US?
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://release.com/whyrelease"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Why Release
                </Link>
              </li>
              <li>
                <Link
                  href="https://release.com/build-vs-buy"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Build vs. Buy
                </Link>
              </li>
              <li>
                <Link
                  href="https://release.com/staging-environments"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Staging Environments
                </Link>
              </li>
              <li>
                <Link
                  href="https://release.com/ephemeral-environments"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Ephemeral Environments
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#00bb93]">
              RESOURCES
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://release.com/blog"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="https://release.com/use-cases"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Use Cases
                </Link>
              </li>
              <li>
                <Link
                  href="https://release.com/case-studies"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Case Studies
                </Link>
              </li>
              <li>
                <Link
                  href="https://release.com/events"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="https://release.com/resource-hub"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Resource Hub
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#00bb93]">
              GET HELP
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://docs.release.com"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Docs
                </Link>
              </li>
              <li>
                <Link
                  href="https://status.release.com/"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Status
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#00bb93]">
              COMPARISONS
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/comparison/gitlab"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Release vs. GitLab
                </Link>
              </li>
              <li>
                <Link
                  href="/comparison/signadot"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Release vs. Signadot
                </Link>
              </li>
              <li>
                <Link
                  href="/comparison/bunnyshell"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Release vs. Bunnyshell
                </Link>
              </li>
              <li>
                <Link
                  href="/comparison/qovery"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Release vs. Qovery
                </Link>
              </li>
              <li>
                <Link
                  href="/comparison/shipyard"
                  className="hover:text-[#00bb93] transition-colors"
                >
                  Release vs. Shipyard
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <nav className="flex items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/legal/terms-of-service"
              className="text-xs hover:underline underline-offset-4"
            >
              Terms
            </Link>
            <Link
              href="/legal/privacy-policy"
              className="text-xs hover:underline underline-offset-4"
            >
              Privacy
            </Link>
            <Link
              href="/legal/security"
              className="text-xs hover:underline underline-offset-4"
            >
              Security
            </Link>
          </nav>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Release Technologies, Inc. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
