"use client";

import RootSEOPageLayout from "@/components/shared/layout/RootSEOPageLayout";
import InvestorLogos from "@/components/shared/InvestorLogos";
import Image from "next/image";
import { Github, Linkedin, X } from "lucide-react";

interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
}

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  socialLinks?: SocialLinks;
}

function SocialIcon({
  href,
  icon: Icon,
  label,
}: {
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-[#00bb93] transition-colors"
      aria-label={label}
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}

function TeamMember({
  name,
  role,
  bio,
  imageUrl,
  socialLinks,
}: TeamMemberProps) {
  return (
    <div className="group relative h-full">
      <div className="bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700/50 group-hover:border-[#00bb93]/50 transition-all duration-300 h-full flex flex-col p-8">
        {/* Image */}
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-900 flex items-center justify-center mb-3">
          <Image
            src={imageUrl}
            alt={name}
            width={128}
            height={128}
            className="w-full h-full object-cover rounded-2xl"
            sizes="(max-width: 768px) 128px, 128px"
            priority
          />
        </div>

        {/* Header */}
        <div className="mb-2">
          <p className="text-[#00bb93] text-xs font-medium uppercase tracking-wider mb-0.5">
            {role}
          </p>
          <h3 className="text-2xl font-semibold text-white">{name}</h3>
        </div>

        <p className="text-gray-300 text-base leading-relaxed flex-grow">
          {bio}
        </p>

        {/* Social Links */}
        {socialLinks && (
          <div className="flex gap-4 mt-3 pt-3 border-t border-gray-700/50">
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00bb93] transition-colors"
                aria-label="X Profile"
              >
                <X className="w-5 h-5" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00bb93] transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CompanyContent() {
  return (
    <RootSEOPageLayout
      title="We exist so people can Release ideas to the world faster"
      description="We are a team of entrepreneurs and systems engineers who've been working on starting companies and building scaleable infrastructure for over 20 years."
    >
      <div className="space-y-32">
        {/* Founders Section */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-12">Founders</h2>
          <p className="text-xl text-gray-300 mb-16 max-w-4xl">
            We are a team of entrepreneurs and systems engineers who've been
            working on starting companies and building scaleable infrastructure
            for over 20 years. We also have amazing families behind the scenes
            supporting us so we can do what we do.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TeamMember
              name="Tommy McClung"
              role="Co-Founder • CEO"
              bio="Co-founder of CarWoo!, YC s2009 which was acquired by TrueCar (CTO/CPO). Founder IMSafer. Software Engineer at RLX Technologies."
              imageUrl="/images/team/tommy-mcclung.jpg"
              socialLinks={{
                linkedin: "https://www.linkedin.com/in/tmcclung/",
                twitter: "https://x.com/tommymcclung",
              }}
            />
            <TeamMember
              name="Erik Landerholm"
              role="Co-Founder"
              bio="Co-founder CarWoo!, Former SVP and Chief Architect at TrueCar. Co-founder, IMSafer. Software Engineer at RLX Technologies."
              imageUrl="/images/team/erik-landerholm.jpg"
              socialLinks={{
                linkedin: "https://www.linkedin.com/in/elanderholm/",
              }}
            />
            <TeamMember
              name="David Giffin"
              role="Co-Founder"
              bio="Early software engineer at Etsy, former SVP Infrastructure at TrueCar. Co-founder, IMSafer. Software Engineer at RLX Technologies."
              imageUrl="/images/team/david-giffin.jpg"
              socialLinks={{
                linkedin: "https://www.linkedin.com/in/david-giffin-5190846/",
              }}
            />
          </div>
        </section>

        {/* Investors Section */}
        <section>
          <InvestorLogos />
        </section>

        {/* Social Media Section */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">
            Other places to find us online
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group relative h-full">
              <div className="bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700/50 group-hover:border-[#00bb93]/50 transition-all duration-300 h-full flex flex-col p-8">
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-900 flex items-center justify-center mb-3">
                  <Linkedin className="w-16 h-16 text-gray-400 group-hover:text-[#00bb93] transition-colors" />
                </div>
                <div className="mb-2">
                  <p className="text-[#00bb93] text-xs font-medium uppercase tracking-wider mb-0.5">
                    Company Page
                  </p>
                  <h3 className="text-2xl font-semibold text-white">
                    LinkedIn
                  </h3>
                </div>
                <p className="text-gray-300 text-base leading-relaxed flex-grow">
                  Follow Release for company updates, job opportunities, and
                  industry insights.
                </p>
                <div className="flex gap-4 mt-3 pt-3 border-t border-gray-700/50">
                  <a
                    href="https://www.linkedin.com/company/releasehub/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00bb93] hover:text-[#00bb93]/80 transition-colors text-sm font-medium"
                  >
                    Visit LinkedIn →
                  </a>
                </div>
              </div>
            </div>

            <div className="group relative h-full">
              <div className="bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700/50 group-hover:border-[#00bb93]/50 transition-all duration-300 h-full flex flex-col p-8">
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-900 flex items-center justify-center mb-3">
                  <X className="w-16 h-16 text-gray-400 group-hover:text-[#00bb93] transition-colors" />
                </div>
                <div className="mb-2">
                  <p className="text-[#00bb93] text-xs font-medium uppercase tracking-wider mb-0.5">
                    Social Feed
                  </p>
                  <h3 className="text-2xl font-semibold text-white">X</h3>
                </div>
                <p className="text-gray-300 text-base leading-relaxed flex-grow">
                  Follow @release_hub for the latest news, product updates, and
                  tech discussions.
                </p>
                <div className="flex gap-4 mt-3 pt-3 border-t border-gray-700/50">
                  <a
                    href="https://x.com/release_hub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00bb93] hover:text-[#00bb93]/80 transition-colors text-sm font-medium"
                  >
                    Visit X →
                  </a>
                </div>
              </div>
            </div>

            <div className="group relative h-full">
              <div className="bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700/50 group-hover:border-[#00bb93]/50 transition-all duration-300 h-full flex flex-col p-8">
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-900 flex items-center justify-center mb-3">
                  <Github className="w-16 h-16 text-gray-400 group-hover:text-[#00bb93] transition-colors" />
                </div>
                <div className="mb-2">
                  <p className="text-[#00bb93] text-xs font-medium uppercase tracking-wider mb-0.5">
                    Open Source
                  </p>
                  <h3 className="text-2xl font-semibold text-white">GitHub</h3>
                </div>
                <p className="text-gray-300 text-base leading-relaxed flex-grow">
                  Explore our open source projects, tools, and contributions to
                  the developer community.
                </p>
                <div className="flex gap-4 mt-3 pt-3 border-t border-gray-700/50">
                  <a
                    href="https://github.com/releasehub-com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00bb93] hover:text-[#00bb93]/80 transition-colors text-sm font-medium"
                  >
                    Visit GitHub →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </RootSEOPageLayout>
  );
}
