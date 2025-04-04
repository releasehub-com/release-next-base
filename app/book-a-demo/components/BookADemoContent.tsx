"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Header from "@/components/shared/layout/Header";
import Footer from "@/components/shared/layout/Footer";
import { InlineWidget } from "react-calendly";
import {
  getVersionFromStorage,
  isValidVersion,
  setVersionInStorage,
  getCanonicalVersion,
  getVersionContent,
  type ValidVersion,
  type VersionId,
  STORAGE_KEY,
  DEFAULT_VERSION,
  VERSIONS,
} from "@/config/versions";
import { resolveVersion } from "@/lib/version/versionService";
import { useVersion } from "@/lib/version/VersionContext";

type IconType =
  | "cost-reduction"
  | "testing"
  | "developer"
  | "cloud-power"
  | "ide"
  | "collaboration"
  | "automation"
  | "kubernetes"
  | "cloud-provider"
  | "security"
  | "gitlab"
  | "pipeline"
  | "git"
  | "scale"
  | "performance";

function BenefitIcon({ icon }: { icon: IconType }) {
  const icons: Record<IconType, JSX.Element> = {
    "cost-reduction": (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    testing: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 3H5C3.89543 3 3 3.89543 3 5V9M9 21H5C3.89543 21 3 20.1046 3 19V15M21 9V5C21 3.89543 20.1046 3 19 3H15M21 15V19C21 20.1046 20.1046 21 19 21H15M12 8V16M8 12H16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    developer: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 9L5 12L8 15M16 9L19 12L16 15M13 7L11 17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "cloud-power": (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 10V3L4 14H11V21L20 10H13Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    ide: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 4L12 12M20 4V8M20 4H16M4 20L12 12M4 20V16M4 20H8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    collaboration: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35625 16.1429M7.35625 16.1429C8.0935 14.301 9.89482 13 12 13C14.1052 13 15.9065 14.301 16.6438 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM21 10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10ZM7 10C7 11.1046 6.10457 12 5 12C3.89543 12 3 11.1046 3 10C3 8.89543 3.89543 8 5 8C6.10457 8 7 8.89543 7 10Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    automation: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 6V4M12 6C10.8954 6 10 6.89543 10 8C10 9.10457 10.8954 10 12 10M12 6C13.1046 6 14 6.89543 14 8C14 9.10457 13.1046 10 12 10M6 18C7.10457 18 8 17.1046 8 16C8 14.8954 7.10457 14 6 14M6 18C4.89543 18 4 17.1046 4 16C4 14.8954 4.89543 14 6 14M6 18V20M6 14V4M12 10V20M18 18C19.1046 18 20 17.1046 20 16C20 14.8954 19.1046 14 18 14M18 18C16.8954 18 16 17.1046 16 16C16 14.8954 16.8954 14 18 14M18 18V20M18 14V4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    kubernetes: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "cloud-provider": (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 15C3 17.2091 4.79086 19 7 19H16C18.7614 19 21 16.7614 21 14C21 11.2386 18.7614 9 16 9C15.9666 9 15.9334 9.00033 15.9002 9.00098C15.4373 6.71825 13.4193 5 11 5C8.23858 5 6 7.23858 6 10C6 10.3768 6.04169 10.7439 6.12071 11.097C4.33457 11.4976 3 13.0929 3 15Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    security: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    gitlab: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22 13.29L12 21L2 13.29L3.79 4.96L7.53 9.96L12 4.43L16.47 9.96L20.21 4.96L22 13.29Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    pipeline: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 4V20M4 4H12M4 4H2M4 20H12M4 20H2M12 4V20M12 4H20M12 4H10M12 20H20M12 20H10M20 4V20M20 4H22M20 20H22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    git: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 5L12 2M12 2L9 5M12 2V14M4 10L2 12M2 12L4 14M2 12H10M20 10L22 12M22 12L20 14M22 12H14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    scale: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 3V7M21 3H17M21 3L15 9M3 21V17M3 21H7M3 21L9 15M21 17V21M21 21H17M21 21L15 15M3 7V3M3 3H7M3 3L9 9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    performance: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  return icons[icon] || null;
}

export default function BookADemoContent() {
  const { version, setVersion } = useVersion();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const versionParam = searchParams.get("version");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Use the resolveVersion function to handle all version resolution logic
    const resolvedVersion = resolveVersion({
      urlVersion: versionParam,
      pathVersion: pathname,
    });

    setVersion(resolvedVersion);
  }, [searchParams, setVersion, versionParam, pathname]);

  // Don't render anything until we have resolved the version and we're on the client
  if (!version || !isClient) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-900">
          <div className="flex flex-col lg:flex-row min-h-screen">
            <div className="w-full lg:w-1/2 p-6 lg:p-16">
              <div className="max-w-xl mx-auto">
                <div className="h-8 bg-gray-800 rounded animate-pulse mb-4 w-3/4"></div>
                <div className="h-24 bg-gray-800 rounded animate-pulse mb-8"></div>
                <div className="border-t border-gray-700 pt-8 hidden lg:block">
                  <div className="h-6 bg-gray-800 rounded animate-pulse mb-6 w-1/2"></div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50"
                      >
                        <div className="h-6 bg-gray-800 rounded animate-pulse mb-2 w-1/3"></div>
                        <div className="h-12 bg-gray-800 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 bg-gray-800 p-6 lg:p-16 border-t lg:border-t-0 lg:border-l border-gray-700">
              <div className="max-w-xl mx-auto">
                <div className="h-8 bg-gray-800 rounded animate-pulse mb-4"></div>
                <div className="h-[600px] bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Get content based on version
  const content = getVersionContent(version);

  // Prepare UTM parameters for Calendly URL
  const calendlyUrl = new URL("https://calendly.com/release-tommy/book-a-demo");
  calendlyUrl.searchParams.set("utm_source", `${version}_landing`);
  calendlyUrl.searchParams.set("utm_medium", "website");
  calendlyUrl.searchParams.set("utm_campaign", "book_demo");
  // Suppress GDPR banner and cookie consent
  calendlyUrl.searchParams.set("hide_gdpr_banner", "1");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <div className="flex flex-col lg:flex-row min-h-screen">
          <div className="w-full lg:w-1/2 p-6 lg:p-16">
            <div className="max-w-xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-100 mb-6">
                {content.title}
              </h1>

              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                Meet with our founding engineers for a technical demonstration
                tailored to your needs. We'll discuss your development
                challenges and show you how Release can help your team ship
                better apps faster.
              </p>

              <div className="border-t border-gray-700 pt-8 hidden lg:block">
                <h2 className="text-xl font-semibold text-gray-100 mb-6">
                  Key Benefits for {content.title}
                </h2>
                <div className="space-y-4">
                  {content.benefits.slice(0, 3).map((benefit, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 flex items-start gap-4"
                    >
                      <BenefitIcon icon={benefit.icon as IconType} />
                      <div>
                        <h3 className="font-semibold mb-2 text-white">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 bg-gray-800 p-6 lg:p-16 border-t lg:border-t-0 lg:border-l border-gray-700">
            <div className="max-w-xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-100 mb-4">
                Book your demo
              </h2>

              <div className="border border-gray-700/50 rounded-lg overflow-hidden">
                <InlineWidget
                  url={calendlyUrl.toString()}
                  styles={{
                    height: "1400px",
                    minWidth: "320px",
                  }}
                  pageSettings={{
                    backgroundColor: "1f2937",
                    hideEventTypeDetails: true,
                    hideLandingPageDetails: false,
                    primaryColor: "00bb93",
                    textColor: "ffffff",
                    hideGdprBanner: true,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
