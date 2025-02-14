"use client";

import RootSEOPageLayout from "@/components/shared/layout/RootSEOPageLayout";
import Image from "next/image";
import { Share2, Lock, Users } from "lucide-react";

export default function DockerExtensionContent() {
  return (
    <RootSEOPageLayout
      title="Instantly share local containers. Fast and free."
      description="Launch secure tunnels with customizable URLs for your local Docker containers. Test, preview, and QA earlier and faster throughout the SDLC."
    >
      <div className="text-lg text-gray-300 space-y-24">
        {/* Hero Section */}
        <div className="relative">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-8">
              <div className="space-y-8">
                <div>
                  <h2 className="text-[#00bb93] text-2xl font-medium mb-6">
                    Release Share Docker Extension
                  </h2>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    Instantly share local containers. Fast and free.
                  </h1>
                </div>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Launch secure tunnels with customizable URLs for your local
                  Docker containers. Test, preview, and QA earlier and faster
                  throughout the SDLC.
                </p>
                <div>
                  <a
                    href="https://hub.docker.com/extensions/releasecom/docker-extension"
                    className="inline-block bg-[#00bb93] hover:bg-[#00bb93]/90 text-white px-8 py-4 rounded-lg font-medium transition-colors"
                  >
                    Try Release Share
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src="/images/product/docker-extension/header.svg"
                    alt="Release Share Docker Extension Interface"
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

        {/* Features Grid */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="aspect-[4/3] relative rounded-xl overflow-hidden">
                <Image
                  src="/images/product/docker-extension/feature-1.webp"
                  alt="Instant Sharing"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-white">Instant Sharing</h3>
              <p className="text-gray-300">
                Pick a locally running container, click "connect", copy the
                custom URL, and share it. That's it! No account. No fees. No
                hassle.
              </p>
            </div>
            <div className="space-y-6">
              <div className="aspect-[4/3] relative rounded-xl overflow-hidden">
                <Image
                  src="/images/product/docker-extension/feature-2.webp"
                  alt="Instant Collaboration"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Instant Collaboration
              </h3>
              <p className="text-gray-300">
                Now your collaborators open the URL, and instead of wondering
                how to get the container image to run, they can focus on using
                what you share and providing feedback on a live app.
              </p>
            </div>
            <div className="space-y-6">
              <div className="aspect-[4/3] relative rounded-xl overflow-hidden">
                <Image
                  src="/images/product/docker-extension/feature-3.webp"
                  alt="Right in your workflow"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Right in your workflow
              </h3>
              <p className="text-gray-300">
                All your live containers with exposed ports are automatically
                mapped and available to share, but with an easy "off" switch.
                Share your work-in-progress or final product with a single
                click.
              </p>
            </div>
          </div>
        </div>

        {/* Steps Section */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-24 text-center">
            How to get started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 w-16 h-16 flex items-center justify-center">
                <Share2 className="w-16 h-16 text-white" strokeWidth={1.5} />
              </div>
              <div className="text-[#00bb93] text-sm font-medium mb-4">01</div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Start your Docker Desktop
              </h3>
              <p className="text-xl text-gray-300">
                Download the latest version
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 w-16 h-16 flex items-center justify-center">
                <Lock className="w-16 h-16 text-white" strokeWidth={1.5} />
              </div>
              <div className="text-[#00bb93] text-sm font-medium mb-4">02</div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Install Release Share
              </h3>
              <p className="text-xl text-gray-300">
                Install directly from Docker Desktop Extensions Marketplace
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 w-16 h-16 flex items-center justify-center">
                <Users className="w-16 h-16 text-white" strokeWidth={1.5} />
              </div>
              <div className="text-[#00bb93] text-sm font-medium mb-4">03</div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Share containers
              </h3>
              <p className="text-xl text-gray-300">
                Choose live containers with exposed ports and instantly share
                custom URLs
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <a
              href="https://hub.docker.com/extensions/releasecom/docker-extension"
              className="inline-block bg-[#00bb93] hover:bg-[#00bb93]/90 text-white px-12 py-4 rounded-full font-medium transition-colors text-lg"
            >
              Install Release Share
            </a>
          </div>
        </div>

        {/* Resources Section */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12">Resources</h2>
          <p className="text-xl text-gray-300 mb-8">
            See how Release works with Docker to build, run and share your apps
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <a
              href="/blog/introducing-release-share-a-docker-desktop-extension"
              className="block group no-underline"
            >
              <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50 h-full transition-colors group-hover:border-[#00bb93]/50 flex flex-col">
                <div className="aspect-[16/9] relative">
                  <Image
                    src="/images/product/docker-extension/resource-1.svg"
                    alt="Introducing Release Share"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                    unoptimized
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#00bb93] line-clamp-2">
                    Introducing Release Share
                  </h3>
                  <p className="text-gray-300 line-clamp-3">
                    Easily share your containers and apps with collaborators and
                    reviewers using Release Share Extension in Docker Desktop.
                  </p>
                </div>
              </div>
            </a>
            <a
              href="/blog/how-to-set-docker-compose-environment-variables"
              className="block group no-underline"
            >
              <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50 h-full transition-colors group-hover:border-[#00bb93]/50 flex flex-col">
                <div className="aspect-[16/9] relative">
                  <Image
                    src="/images/product/docker-extension/resource-2.webp"
                    alt="Docker Compose Environment Variables"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#00bb93] line-clamp-2">
                    Docker Compose Environment Variables
                  </h3>
                  <p className="text-gray-300 line-clamp-3">
                    How to define environment variables directly in a Docker
                    Compose file, or copy them from the host's environment.
                  </p>
                </div>
              </div>
            </a>
            <a
              href="/webinar-on-demand/build-run-share-with-docker-and-release"
              className="block group no-underline"
            >
              <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50 h-full transition-colors group-hover:border-[#00bb93]/50 flex flex-col">
                <div className="aspect-[16/9] relative">
                  <Image
                    src="/images/product/docker-extension/resource-3.webp"
                    alt="Build, Run, Share with Docker and Release"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#00bb93] line-clamp-2">
                    Build, Run, Share with Docker and Release
                  </h3>
                  <p className="text-gray-300 line-clamp-3">
                    Learn best practices, tips and techniques for using Docker
                    and Release to accelerate dev/test for complex applications.
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Want to share your full stack in a production-like environment?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Try out Release and see what's possible. Use code #docker for 30
            days free.
          </p>
          <a
            href="https://release.com/signup"
            className="inline-block bg-[#00bb93] hover:bg-[#00bb93]/90 text-white px-8 py-4 rounded-lg font-medium transition-colors"
          >
            Sign up for Release
          </a>
        </div>
      </div>
    </RootSEOPageLayout>
  );
}
