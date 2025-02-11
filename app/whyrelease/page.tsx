import type { Metadata } from "next";
import RootSEOPageLayout from "@/components/RootSEOPageLayout";
import UserLogos from "@/components/UserLogos";
import InvestorLogos from "@/components/InvestorLogos";
import { Settings, Users, Rocket } from "lucide-react";
import Image from "next/image";

function ValuePropCard({
  icon,
  title,
  description,
}: {
  icon: "automation" | "collaboration" | "rocket";
  title: string;
  description: string;
}) {
  const icons = {
    automation: <Settings className="w-6 h-6 text-white" />,
    collaboration: <Users className="w-6 h-6 text-white" />,
    rocket: <Rocket className="w-6 h-6 text-white" />,
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700/50">
      <div className="flex flex-col gap-4">
        <div className="w-12 h-12 rounded-lg bg-gray-700/50 flex items-center justify-center">
          {icons[icon]}
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-gray-300 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Why Release | Release",
  description:
    "With Release, you can build, test, and deploy applications at scale. Our Environments as a Service platform automates the process to allow your developer teams to focus on innovation and revenue.",
  openGraph: {
    title: "Why Release | Release",
    description:
      "With Release, you can build, test, and deploy applications at scale. Our Environments as a Service platform automates the process to allow your developer teams to focus on innovation and revenue.",
    type: "article",
    url: "https://release.com/whyrelease",
    images: [
      {
        url: "https://release.com/og/whyrelease.png",
        width: 1200,
        height: 630,
        alt: "Why Release",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Release | Release",
    description:
      "With Release, you can build, test, and deploy applications at scale. Our Environments as a Service platform automates the process to allow your developer teams to focus on innovation and revenue.",
    images: ["https://release.com/og/whyrelease.png"],
  },
  alternates: {
    canonical: "https://release.com/whyrelease",
  },
};

export default function WhyReleasePage() {
  return (
    <RootSEOPageLayout
      title="Release your ideas to the world faster"
      description="With Release, you can build, test, and deploy applications at scale. With our offering, Environments as a Service, we automate the process to allow your developer teams to focus on innovation and revenue rather than building and maintaining test environments. Made by developers, for developers, you can ship faster with confidence."
    >
      <div className="text-lg text-gray-300 space-y-12">
        {/* Introduction Paragraph */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700/50">
            <p className="text-2xl text-gray-300 leading-relaxed text-center">
              With Release, you can build, test, and deploy applications at
              scale. With our offering, Environments as a Service, we automate
              the process to allow your developer teams to focus on innovation
              and revenue rather than building and maintaining test
              environments. Made by developers, for developers, you can ship
              faster with confidence.
            </p>
          </div>
        </div>

        {/* Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ValuePropCard
            icon="automation"
            title="Automate"
            description="Streamline the development process by automatically creating environments in the application creation lifecycle. Connect and combine your external services into a single environment."
          />
          <ValuePropCard
            icon="collaboration"
            title="Collaborate"
            description="Enable your teams to spin up environments on the fly and preview every feature change with a dedicated environment. Get feedback early in the development stage."
          />
          <ValuePropCard
            icon="rocket"
            title="Ship Faster"
            description="Speed up development cycles by testing code changes in isolation and ship high-quality code faster. Decrease costs by tearing down environments after use."
          />
        </div>

        {/* Video Section */}
        <div className="relative rounded-lg overflow-hidden bg-gray-800/50 border border-gray-700/50">
          <div className="aspect-w-16 aspect-h-9">
            <video
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
              controls
              poster="/images/why-release-poster.png"
            >
              <source
                src="https://marketing.release.com/video/what_is_release_(1080p).mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Customer Quote */}
        <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700/50">
          <blockquote className="space-y-4">
            <p className="text-xl text-gray-300 italic">
              Release has helped cut our testing time from days to minutes and
              provided insight to how we can optimize internally. It has enabled
              us to involve more teams to review feature updates and increase
              synergy within our company.
            </p>
            <footer className="text-white">
              <p className="font-semibold">Wendi Whitsett</p>
              <p className="text-gray-400">Software Engineer • Chipper Cash</p>
            </footer>
          </blockquote>
        </div>

        {/* Customer Logos */}
        <div className="py-12">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Trusted by innovative teams
          </h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-900 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-900 to-transparent z-10" />
            <div className="overflow-x-auto scrollbar-hide">
              <div className="px-8">
                <UserLogos layout="horizontal" />
              </div>
            </div>
          </div>
        </div>

        {/* Investors Section */}
        <InvestorLogos />

        {/* Related Resources */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-6 border-b border-gray-800 pb-4">
            Related Resources
          </h2>

          <ul className="list-none pl-0 space-y-4">
            <li>
              <a
                href="/build-vs-buy"
                className="text-[#00bb93] hover:text-[#00bb93]/80 transition-colors flex items-center"
              >
                <span className="mr-2">→</span>
                Build vs Buy
              </a>
            </li>
            <li>
              <a
                href="/staging-environments"
                className="text-[#00bb93] hover:text-[#00bb93]/80 transition-colors flex items-center"
              >
                <span className="mr-2">→</span>
                Staging Environments
              </a>
            </li>
            <li>
              <a
                href="/ephemeral-environments"
                className="text-[#00bb93] hover:text-[#00bb93]/80 transition-colors flex items-center"
              >
                <span className="mr-2">→</span>
                Ephemeral Environments
              </a>
            </li>
          </ul>
        </div>
      </div>
    </RootSEOPageLayout>
  );
}
