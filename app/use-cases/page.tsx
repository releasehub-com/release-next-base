"use client";

import RootSEOPageLayout from "@/components/shared/layout/RootSEOPageLayout";
import Link from "next/link";
import {
  Layers,
  Server,
  Eye,
  TestTube2,
  Box,
  ArrowRightLeft,
  Gauge,
  Store,
  Cpu,
  ArrowRight,
  Cloud,
  Rocket,
  Package,
  LucideIcon,
} from "lucide-react";

interface UseCaseCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  cta?: string;
}

function UseCaseCard({
  title,
  description,
  icon: Icon,
  href,
  cta,
}: UseCaseCardProps) {
  const cardContent = (
    <>
      <div className="p-4 pb-3 mb-4 border-b border-gray-700/50 bg-gray-800/70 rounded-t-lg">
        <div className="p-2 bg-[#00bb93]/10 rounded-lg inline-block leading-none">
          <Icon className="w-6 h-6 text-[#00bb93]" />
        </div>
        <h2 className="text-lg font-bold text-white/90 min-h-[3.5rem] mt-1 break-words">
          {title}
        </h2>
      </div>
      <div className="px-4 flex flex-col flex-1">
        <p className="text-gray-300 text-base leading-relaxed break-words mb-6">
          {description}
        </p>
        {cta && (
          <div className="mt-auto pt-4 border-t border-gray-700/50">
            <button className="w-full py-2 px-3 bg-[#00bb93]/10 hover:bg-[#00bb93]/20 rounded-lg transition-colors text-[#00bb93] font-medium flex items-center justify-center text-sm whitespace-nowrap">
              <span>{cta}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 flex-shrink-0" />
            </button>
          </div>
        )}
      </div>
    </>
  );

  return href ? (
    <Link
      href={href}
      className="bg-gray-800/30 rounded-lg border border-gray-700/50 flex flex-col hover:bg-gray-800/40 transition-colors cursor-pointer no-underline"
    >
      {cardContent}
    </Link>
  ) : (
    <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 flex flex-col hover:bg-gray-800/40 transition-colors">
      {cardContent}
    </div>
  );
}

interface UseCase {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  cta?: string;
}

const USE_CASES: UseCase[] = [
  {
    title: "On-demand Ephemeral Staging Environments",
    description:
      "Too often staging environments are proceeded by another stage, the limbo stage. A.K.A. the thumb-twiddling stage. A.K.A. the hurry-up and let me in stage. With Release Environments, staging happens on-demand and at a click.",
    icon: Layers,
    href: "/ephemeral-environments-platform",
    cta: "Learn more about Release Environments",
  },
  {
    title: "Modern PaaS Alternative",
    description:
      "Looking for a Heroku alternative? Release provides the same developer-friendly experience but with more power and flexibility. Deploy applications with a simple git push while maintaining full access to your cloud infrastructure.",
    icon: Cloud,
    href: "/platform-as-a-service",
    cta: "Learn more about Release Cloud",
  },
  {
    title: "Cloud Development Environments",
    description:
      "Spin up full development environments in seconds, complete with all your tools and dependencies. Share environments instantly with your team, making code reviews and pair programming effortless while eliminating local setup headaches.",
    icon: Server,
    href: "/cloud-development-environments",
    cta: "Learn more about Cloud Development",
  },
  {
    title: "AI-Ready Infrastructure Pipeline",
    description:
      "As AI accelerates individual developer productivity, your infrastructure needs to keep pace. Release eliminates deployment bottlenecks and environment wait times, ensuring your team's deployment velocity matches their development speed. Let developers focus on building great software while AI and automation handle the rest.",
    icon: Rocket,
    href: "/ai-ready-infrastructure-pipeline",
    cta: "Learn more about AI-Ready Infrastructure",
  },
  {
    title: "AI Environments",
    description:
      "Build and deploy AI applications with ease. Get instant access to GPU-powered environments for training and inference, with all the tools and dependencies you need for ML development.",
    icon: Cpu,
    href: "https://release.ai",
    cta: "Learn more about Release.ai",
  },
  {
    title: "Running your Production Environments",
    description:
      "Once you discover how simple Release is, you'll understand that bringing pre-production and production together is easy. In a unified ecosystem, you can deploy pre-production environments and run production workloads using aligned data.",
    icon: Server,
  },
  {
    title: "Deploy Automated Preview Environments",
    description:
      "Automated Preview Environments keep every stakeholder in the loop – and on the path to better products. Our Automated Preview Environments bring all stakeholders into the development cycle from the beginning.",
    icon: Eye,
  },
  {
    title: "Unlimited QA/Validation Environments",
    description:
      "Time spent testing new features shouldn't be limited by the availability of environments, or hindered by a lack of trust in them. Release Environments can be created for any code branch, on-demand and loaded with your data.",
    icon: TestTube2,
  },
  {
    title: "Dev Sandbox/R&D Playground",
    description:
      "Imagine if environments were less 'Don't go in there!' and more 'This place is awesome!'. You'd explore more, play more and make more things happen. Release Environments give developers the space to release their creativity.",
    icon: Box,
  },
  {
    title: "Migration Test Environments",
    description:
      "Got a big migration on the horizon? We enable you to test migrations using production-like data, so you know it's going to work before you push to production. Do migrations without the migraines.",
    icon: ArrowRightLeft,
  },
  {
    title: "Performance Test Environments",
    description:
      "Testing performance shouldn't be such a test. Release Environments enable you to create environments that replicate production with ease. They can be scaled, supply additional resources and are simple to modify.",
    icon: Gauge,
  },
  {
    title: "Sales Demo Environments",
    description:
      "There's no better way to close a sale than by letting your customers experience your product – exactly as it should be experienced. Release Environments allow you to create isolated demo environments for your customers on-demand.",
    icon: Store,
  },
  {
    title: "Enterprise Software Delivery",
    description:
      "Ship your cloud-native applications to enterprise customers with ease. Release Delivery provides a container-based platform for deploying your software on-premises, in private clouds, or hybrid environments while maintaining all your SaaS features.",
    icon: Package,
    href: "/product/release-delivery",
    cta: "Learn more about Release Delivery",
  },
] as const;

export default function UseCasesPage() {
  return (
    <RootSEOPageLayout
      title="Use Cases: All the ways our customers use Release"
      description="From short-lived production-like environments for building and testing features, to running complex applications in production. See how Release streamlines software delivery across the whole application lifecycle."
    >
      <div className="not-prose">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {USE_CASES.map((useCase, index) => (
            <UseCaseCard
              key={index}
              title={useCase.title}
              description={useCase.description}
              icon={useCase.icon}
              href={useCase.href}
              cta={useCase.cta}
            />
          ))}
        </div>
      </div>
    </RootSEOPageLayout>
  );
}
