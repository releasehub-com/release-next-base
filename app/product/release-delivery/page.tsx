"use client";

import RootSEOPageLayout from "@/components/RootSEOPageLayout";
import Image from "next/image";
import {
  Cloud,
  Terminal,
  Settings,
  Layout,
  RefreshCw,
  Wrench,
  LineChart,
  FileCode,
  GitBranch,
} from "lucide-react";
import CalendlyButton from "./components/CalendlyButton";

export default function ReleaseDeliveryPage() {
  return (
    <RootSEOPageLayout
      title="Automate your software delivery pipeline"
      description="Deploy faster and more reliably with automated pipelines, infrastructure as code, and comprehensive testing. Release Delivery streamlines your deployment process from development to production."
      calendlyUrl="https://calendly.com/release-tommy/release-delivery"
    >
      <div className="text-lg text-gray-300 space-y-24">
        {/* Hero Section */}
        <div className="relative">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start pt-4">
              <div className="space-y-8 lg:sticky lg:top-8 lg:-mt-8">
                <div>
                  <h2 className="text-[#00bb93] text-2xl font-medium mb-6">
                    Release Delivery
                  </h2>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    The Modern Way to Deliver and Manage Cloud Software to
                    Customers
                  </h1>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Release Delivery is a container-based Environments as a
                  Service platform that gives software vendors a fast and easy
                  way to ship their applications inside customers' environments.
                  Whether it's on-premises, in a private cloud, or in a hybrid
                  model, Release lets you deliver your software with the same
                  features and functionality as your SaaS offering.
                </p>
                <div>
                  <CalendlyButton className="inline-block bg-[#00bb93] hover:bg-[#00bb93]/90 text-white px-8 py-4 rounded-lg font-medium transition-colors cursor-pointer">
                    Book Demo of Release Delivery
                  </CalendlyButton>
                </div>
              </div>
              <div className="relative lg:mt-24">
                <div className="relative rounded-2xl overflow-hidden bg-white/[0.15] backdrop-blur-[2px] border border-white/[0.2] p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.2] to-transparent pointer-events-none"></div>
                  <div className="relative rounded-xl overflow-hidden">
                    <Image
                      src="/images/product/release-delivery/header.svg"
                      alt="Release Delivery Platform Interface"
                      width={2000}
                      height={1500}
                      className="w-full h-auto"
                      priority
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50 h-full">
              <div className="p-6 space-y-6">
                <div className="w-16 h-16 relative">
                  <Image
                    src="/images/product/release-delivery/feature-1.svg"
                    alt="Make your apps enterprise ready"
                    fill
                    className="object-contain brightness-0 invert"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Make your apps enterprise ready
                  </h3>
                  <p className="text-gray-300">
                    Sell your cloud-native applications to enterprise customers
                    who need greater security and control over their data and
                    infrastructure.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50 h-full">
              <div className="p-6 space-y-6">
                <div className="w-16 h-16 relative">
                  <Image
                    src="/images/product/release-delivery/feature-2.svg"
                    alt="Orchestrate across environments"
                    fill
                    className="object-contain brightness-0 invert"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Orchestrate across environments
                  </h3>
                  <p className="text-gray-300">
                    Avoid the hassle of building and maintaining your own
                    tooling for deploying, updating, licensing, monitoring, and
                    troubleshooting your software across different environments.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50 h-full">
              <div className="p-6 space-y-6">
                <div className="w-16 h-16 relative">
                  <Image
                    src="/images/product/release-delivery/feature-3.svg"
                    alt="Delight your customers"
                    fill
                    className="object-contain brightness-0 invert"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Delight your customers
                  </h3>
                  <p className="text-gray-300">
                    Focus on product innovation and a great customer experience
                    instead of spending time and money on custom integrations
                    and support requests.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Capabilities Section */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12">
            With Release Delivery, you can
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <div className="flex flex-col items-start gap-4">
                <Terminal className="w-8 h-8 text-white" />
                <p className="text-gray-300">
                  Troubleshoot issues remotely with secure access to logs,
                  snapshots, backups, etc.
                </p>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <div className="flex flex-col items-start gap-4">
                <Cloud className="w-8 h-8 text-white" />
                <p className="text-gray-300">
                  Leverage Kubernetes as the underlying orchestration layer for
                  your application.
                </p>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <div className="flex flex-col items-start gap-4">
                <Settings className="w-8 h-8 text-white" />
                <p className="text-gray-300">
                  Customize your application for different customer needs with
                  dynamic configuration options.
                </p>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <div className="flex flex-col items-start gap-4">
                <Layout className="w-8 h-8 text-white" />
                <p className="text-gray-300">
                  Provide a consistent installation experience for your
                  customers with an intuitive web-based console.
                </p>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <div className="flex flex-col items-start gap-4">
                <RefreshCw className="w-8 h-8 text-white" />
                <p className="text-gray-300">
                  Automate updates and patches with built-in version management
                  and rollback capabilities.
                </p>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <div className="flex flex-col items-start gap-4">
                <Wrench className="w-8 h-8 text-white" />
                <p className="text-gray-300">
                  Use familiar tools like Helm, Kustomize, Terraform, Ansible,
                  etc. for packaging and configuring your application.
                </p>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <div className="flex flex-col items-start gap-4">
                <LineChart className="w-8 h-8 text-white" />
                <p className="text-gray-300">
                  Monitor the health and performance of your application with
                  integrated metrics and alerts.
                </p>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <div className="flex flex-col items-start gap-4">
                <FileCode className="w-8 h-8 text-white" />
                <p className="text-gray-300">
                  Automatically interrogate your app structure and build a
                  delivery plan for your applications from existing Docker
                  Compose or other markup documents.
                </p>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <div className="flex flex-col items-start gap-4">
                <GitBranch className="w-8 h-8 text-white" />
                <p className="text-gray-300">
                  Install multiple versions of your software into a customer
                  environment for evaluation and testing without interrupting
                  existing systems.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12">Trusted by</h2>
          <div className="grid grid-cols-3 gap-8 items-center justify-items-center">
            <Image
              src="/images/product/release-delivery/customer-1.svg"
              alt="Monad company logo"
              width={200}
              height={80}
              className="h-12 w-auto brightness-0 invert"
              unoptimized
            />
            <Image
              src="/images/product/release-delivery/customer-2.svg"
              alt="Datasaur.ai company logo"
              width={200}
              height={80}
              className="h-12 w-auto brightness-0 invert"
              unoptimized
            />
            <Image
              src="/images/product/release-delivery/customer-3.svg"
              alt="Stemma company logo"
              width={200}
              height={80}
              className="h-12 w-auto brightness-0 invert"
              unoptimized
            />
          </div>
        </div>

        {/* Resources Section */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12">Learn more</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <a
              href="/blog/release-delivery-helps-saas-companies-meet-the-needs-of-their-enterprise-customers"
              className="block group no-underline"
            >
              <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50 h-full transition-colors group-hover:border-[#00bb93]/50 flex flex-col">
                <div className="aspect-[16/9] relative">
                  <Image
                    src="/images/product/release-delivery/resource-2.svg"
                    alt="Release Delivery Blog"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#00bb93] line-clamp-2">
                    Blog
                  </h3>
                  <p className="text-gray-300 line-clamp-3">
                    Release Delivery helps SaaS companies meet the needs of
                    their enterprise customers
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </RootSEOPageLayout>
  );
}
