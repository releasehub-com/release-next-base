"use client";

import RootSEOPageLayout from "@/components/shared/layout/RootSEOPageLayout";
import Image from "next/image";
import { ArrowRight, Cloud, Database, Zap } from "lucide-react";

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700/50">
      <div className="flex flex-col gap-4">
        <div className="text-sm font-medium text-[#00bb93]">Step {number}</div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-gray-300 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function DatabaseLogo({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-16 h-16 bg-gray-800/50 rounded-lg flex items-center justify-center border border-gray-700/50">
        <Image
          src={`/images/product/instant-datasets/db-${name.toLowerCase()}.png`}
          alt={`${name} logo`}
          width={40}
          height={40}
        />
      </div>
      <span className="text-sm text-gray-300">{name}</span>
    </div>
  );
}

export default function InstantDatasetsContent() {
  return (
    <RootSEOPageLayout
      title="Build and test apps with real data, instantly"
      description="Now you can test against realistic, up-to-date datasets with speed and safety. Match your application's behavior to production. Creating and maintaining production-like datasets has never been easier."
    >
      <div className="text-lg text-gray-300 space-y-24">
        {/* Hero Section */}
        <div className="relative">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-8">
              <div className="space-y-8">
                <div>
                  <h2 className="text-[#B341F4] text-2xl font-medium mb-6">
                    Release Instant Datasets
                  </h2>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    Build and test apps with real data, instantly
                  </h1>
                </div>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Now you can test against realistic, up-to-date datasets with
                  speed and safety. Match your application's behavior to
                  production. Creating and maintaining production-like datasets
                  has never been easier.
                </p>
                <div>
                  <a
                    href="https://web.release.com/instantdatasets/register"
                    className="inline-block bg-[#B341F4] hover:bg-[#B341F4]/90 text-white px-8 py-4 rounded-lg font-medium transition-colors"
                  >
                    Try Instant Datasets Free
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src="/images/product/instant-datasets/header.webp"
                    alt="Release Instant Datasets Code Editor"
                    width={2000}
                    height={1500}
                    className="w-full h-auto"
                    priority
                  />
                  <div className="absolute bottom-8 left-24 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg px-10 py-6">
                    <Image
                      src="/images/product/instant-datasets/database-logo.svg"
                      alt="Database Icon"
                      width={96}
                      height={96}
                      className="w-24 h-24"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl sm:text-5xl font-bold text-white">
                Instant Datasets helps you:
              </h2>
              <ul className="space-y-6 list-none pl-0">
                <li className="flex items-start gap-4">
                  <div className="mt-1.5">
                    <svg
                      className="w-5 h-5 text-[#00bb93]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </div>
                  <span className="text-xl text-gray-300">
                    Easily clone production and other data needed by your
                    environments
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1.5">
                    <svg
                      className="w-5 h-5 text-[#00bb93]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </div>
                  <span className="text-xl text-gray-300">
                    Test code against real-world scenarios and edge cases to
                    quickly resolve bugs that only appear with production-like
                    data
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1.5">
                    <svg
                      className="w-5 h-5 text-[#00bb93]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </div>
                  <span className="text-xl text-gray-300">
                    Protect sensitive data with encryption and masking options
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1.5">
                    <svg
                      className="w-5 h-5 text-[#00bb93]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </div>
                  <span className="text-xl text-gray-300">
                    Reduce storage costs by pausing datasets on schedule or when
                    not in use
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1.5">
                    <svg
                      className="w-5 h-5 text-[#00bb93]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </div>
                  <span className="text-xl text-gray-300">
                    Automate your data replication workflows with APIs and
                    integrations
                  </span>
                </li>
              </ul>
            </div>
            <div className="relative flex justify-center items-center">
              <Image
                src="/images/product/instant-datasets/features-illustration.svg"
                alt="Instant Datasets Features Illustration"
                width={600}
                height={600}
                className="w-full h-auto"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Steps Section */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-24 text-center">
            Production-like data in 3 steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 w-16 h-16 flex items-center justify-center">
                <Cloud className="w-16 h-16 text-white" strokeWidth={1.5} />
              </div>
              <div className="text-[#00bb93] text-sm font-medium mb-4">
                STEP 1
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Connect your cloud account
              </h3>
              <p className="text-xl text-gray-300">
                Set up a cloud integration with minimal permissions. Your
                datasets are managed entirely inside your cloud account.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 w-16 h-16 flex items-center justify-center">
                <Database className="w-16 h-16 text-white" strokeWidth={1.5} />
              </div>
              <div className="text-[#00bb93] text-sm font-medium mb-4">
                STEP 2
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Create your dataset pool
              </h3>
              <p className="text-xl text-gray-300">
                Choose your source data, the number of available databases, and
                data scrubbing options as needed.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 w-16 h-16 flex items-center justify-center">
                <Zap className="w-16 h-16 text-white" strokeWidth={1.5} />
              </div>
              <div className="text-[#00bb93] text-sm font-medium mb-4">
                STEP 3
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Build and test with your data
              </h3>
              <p className="text-xl text-gray-300">
                Check databases in and out how you like: through Release UI, via
                API or CLI of your choice.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <a
              href="https://web.release.com/instantdatasets/register"
              className="inline-block bg-[#00bb93] hover:bg-[#00bb93]/90 text-white px-12 py-4 rounded-full font-medium transition-colors text-lg"
            >
              Try Instant Datasets Free
            </a>
          </div>
        </div>

        {/* Database Support Section */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl sm:text-5xl font-bold text-white">
                Works with your databases and cloud platforms
              </h2>
              <div className="space-y-6">
                <p className="text-xl text-gray-300">
                  Datasets supports all AWS database services: RDS, Aurora,
                  MySQL, PostgreSQL, Oracle, MariaDB, SQL Server and others.
                </p>
                <p className="text-xl text-gray-300">
                  We are constantly adding new integrations and services. Google
                  and Azure clouds are coming, and soon you will be able to
                  connect your CloudSQL, MongoDB Atlas and other databases.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <div className="relative">
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 flex items-center justify-center">
                  <Image
                    src="/images/product/instant-datasets/logos/aws.svg"
                    alt="AWS Logo"
                    width={160}
                    height={48}
                    className="w-40 h-12"
                    unoptimized
                  />
                </div>
              </div>
              <div className="relative">
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 flex items-center justify-center">
                  <Image
                    src="/images/product/instant-datasets/logos/mysql.svg"
                    alt="MySQL Logo"
                    width={160}
                    height={48}
                    className="w-40 h-12"
                    unoptimized
                  />
                </div>
              </div>
              <div className="relative">
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 flex items-center justify-center">
                  <Image
                    src="/images/product/instant-datasets/logos/postgresql.svg"
                    alt="PostgreSQL Logo"
                    width={160}
                    height={48}
                    className="w-40 h-12"
                    unoptimized
                  />
                </div>
              </div>
              <div className="relative">
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 flex items-center justify-center">
                  <Image
                    src="/images/product/instant-datasets/logos/gcp.svg"
                    alt="GCP Logo"
                    width={160}
                    height={48}
                    className="w-40 h-12"
                    unoptimized
                  />
                </div>
              </div>
              <div className="relative">
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 flex items-center justify-center relative">
                  <Image
                    src="/images/product/instant-datasets/logos/azure.svg"
                    alt="Azure Logo"
                    width={160}
                    height={48}
                    className="w-40 h-12"
                    unoptimized
                  />
                  <div className="absolute -top-2 -right-2 bg-gray-700 text-xs text-white px-2 py-1 rounded">
                    Coming soon
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 flex items-center justify-center">
                  <Image
                    src="/images/product/instant-datasets/logos/mariadb.svg"
                    alt="MariaDB Logo"
                    width={160}
                    height={48}
                    className="w-40 h-12"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="relative max-w-[1440px] mx-auto mt-24">
          <div className="relative rounded-2xl overflow-hidden bg-gray-800/50 border border-gray-700/50">
            <div className="aspect-video relative">
              <iframe
                src="https://player.vimeo.com/video/849156936?h=8cf2de07d3&badge=0&autopause=0&autoplay=0&player_id=0&app_id=58479"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Release Instant Datasets - How to Get Started"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-4 max-w-fit">
            <Image
              src="/images/product/instant-datasets/employee.webp"
              alt="Release employee"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <div className="text-white font-medium">
                Instant Datasets - how to get started
              </div>
              <div className="text-[#B341F4] text-sm">Watch now • 7 min</div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-8 mt-16">
            Resources to get you started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50">
              <a
                href="https://docs.release.com/release-instant-datasets/quickstart"
                className="block"
              >
                <div className="aspect-video relative">
                  <Image
                    src="/images/product/instant-datasets/resources/quickstart.webp"
                    alt="Instant Datasets Quick-Start Cover"
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                  />
                </div>
              </a>
              <div className="p-6">
                <a
                  href="https://docs.release.com/release-instant-datasets/quickstart"
                  className="block"
                >
                  <h3 className="text-xl font-semibold text-white hover:text-[#00bb93] transition-colors">
                    Instant Datasets Quick-Start
                  </h3>
                </a>
                <p className="text-gray-300 mt-4">
                  All you need to know about Instant Datasets in an easy guide.
                </p>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50">
              <a
                href="https://release.com/blog/introducing-standalone-instant-datasets-build-and-test-with-realistic-production-like-data-with-ease"
                className="block"
              >
                <div className="aspect-video relative">
                  <Image
                    src="/images/product/instant-datasets/resources/announcement.webp"
                    alt="Introducing Standalone Instant Datasets Cover"
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                  />
                </div>
              </a>
              <div className="p-6">
                <a
                  href="https://release.com/blog/introducing-standalone-instant-datasets-build-and-test-with-realistic-production-like-data-with-ease"
                  className="block"
                >
                  <h3 className="text-xl font-semibold text-white hover:text-[#00bb93] transition-colors">
                    Introducing Standalone Instant Datasets
                  </h3>
                </a>
                <p className="text-gray-300 mt-4">
                  Release Instant Datasets is now a standalone product allowing
                  everyone to build and test with production-like data.
                </p>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50">
              <a
                href="https://docs.release.com/reference-documentation/instant-datasets-aws"
                className="block"
              >
                <div className="aspect-video relative">
                  <Image
                    src="/images/product/instant-datasets/resources/ephemeral.svg"
                    alt="Ephemeral Resources"
                    width={160}
                    height={48}
                    className="w-40 h-12"
                    unoptimized
                  />
                </div>
              </a>
              <div className="p-6">
                <a
                  href="https://docs.release.com/reference-documentation/instant-datasets-aws"
                  className="block"
                >
                  <h3 className="text-xl font-semibold text-white hover:text-[#00bb93] transition-colors">
                    Ephemeral environments with production-like data
                  </h3>
                </a>
                <p className="text-gray-300 mt-4">
                  Instant Datasets is a core feature of the Release platform.
                  Learn how it works along with ephemeral environments.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Create your account today
          </h2>
          <a
            href="https://web.release.com/instantdatasets/register"
            className="inline-block bg-[#00bb93] hover:bg-[#00bb93]/90 text-white px-8 py-4 rounded-lg font-medium transition-colors"
          >
            Try Instant Datasets Free
          </a>
        </div>
      </div>
    </RootSEOPageLayout>
  );
}
