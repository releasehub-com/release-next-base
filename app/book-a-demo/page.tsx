"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import { SignupMessage } from "../signup/components/SignupMessage";

function BenefitIcon({ icon }: { icon: string }) {
  const icons = {
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
  };

  return (
    <div className="text-[#00bb93]">
      {icons[icon] || (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 6V12L16 14M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

// Helper function to set version in both localStorage and cookie
async function setVersion(version: VersionId) {
  // Set in localStorage
  setVersionInStorage(version);

  // Set in cookie via API
  try {
    await fetch("/api/version", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ version }),
    });
  } catch (err) {
    console.error("Failed to set version cookie:", err);
  }
}

function BookADemoContent() {
  const [version, setVersionState] = useState<VersionId | null>(null);
  const searchParams = useSearchParams();
  const versionParam = searchParams.get("version");

  useEffect(() => {
    const storedVersion = getVersionFromStorage();

    // Handle version resolution and aliases
    let resolvedVersion: VersionId = "ephemeral";
    if (versionParam === "ai") {
      // Store ephemeral version but don't update state yet
      setVersion("ephemeral");
    } else if (versionParam && isValidVersion(versionParam)) {
      resolvedVersion = getCanonicalVersion(versionParam);
      setVersion(resolvedVersion);
    } else if (storedVersion) {
      resolvedVersion = storedVersion;
      setVersion(resolvedVersion);
    } else {
      resolvedVersion = DEFAULT_VERSION;
      setVersion(DEFAULT_VERSION);
    }

    setVersionState(resolvedVersion);
  }, [searchParams, version, versionParam]);

  // Don't render anything until we have resolved the version
  if (!version) {
    return null;
  }

  // Get content based on version
  const content =
    versionParam === "ai"
      ? VERSIONS.ephemeral.signupContent
      : getVersionContent(version);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <div className="flex flex-col lg:flex-row min-h-screen">
          <div className="w-full lg:w-1/2 p-6 lg:p-16">
            <div className="max-w-xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-100 mb-6">
                Technical discussion. No fluff.
              </h1>

              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                We believe each developer should have instant access to
                isolated, near-production environments for every step of the
                development process. With no lines. With no friction. With no
                worries of breaking things.
              </p>

              <div className="mb-8">
                <p className="text-gray-300 text-lg leading-relaxed">
                  Meet with our founding engineers for a technical demonstration
                  tailored to your needs. We'll discuss your development
                  challenges and show you how Release can help your team ship
                  better apps faster.
                </p>
              </div>

              <div className="border-t border-gray-700 pt-8 hidden lg:block">
                <h2 className="text-xl font-semibold text-gray-100 mb-6">
                  {content.title}
                </h2>
                <div className="space-y-4">
                  {content.benefits.slice(0, 3).map((benefit, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 flex items-start gap-4"
                    >
                      <BenefitIcon icon={benefit.icon} />
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

          <div className="w-full lg:w-1/2 p-6 lg:p-16 bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-700">
            <div className="max-w-xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-100 mb-4">
                Book your demo
              </h2>

              <div className="border border-gray-700/50 rounded-lg overflow-hidden">
                <InlineWidget
                  url="https://calendly.com/release-tommy/book-a-demo"
                  styles={{
                    height: "700px",
                    minWidth: "320px",
                  }}
                  pageSettings={{
                    backgroundColor: "1f2937",
                    hideEventTypeDetails: true,
                    hideLandingPageDetails: false,
                    primaryColor: "00bb93",
                    textColor: "ffffff",
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

export default function BookADemoPage() {
  return (
    <Suspense fallback={null}>
      <BookADemoContent />
    </Suspense>
  );
}
