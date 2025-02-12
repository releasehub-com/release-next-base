"use client";

import React from "react";
import Image from "next/image";
import { CaseStudyFrontmatter } from "../types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface CaseStudyPageProps {
  content: React.ReactNode;
  frontmatter: CaseStudyFrontmatter;
}

export default function CaseStudyPage({
  content,
  frontmatter,
}: CaseStudyPageProps) {
  return (
    <>
      <Header />
      {/* Add SVG Filter definition */}
      <svg className="hidden">
        <defs>
          <filter id="white-logo-filter">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 1
                      0 1 0 0 1
                      0 0 1 0 1
                      0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      <main className="min-h-screen bg-gray-900">
        {/* Hero Section */}
        <div className="relative bg-gray-800 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {frontmatter.logo && (
                <div className="mb-6">
                  <Image
                    src={frontmatter.logo}
                    alt={`${frontmatter.title} logo`}
                    width={160}
                    height={40}
                    className="mx-auto brightness-0 invert"
                    unoptimized={frontmatter.logo.endsWith('.svg')}
                  />
                </div>
              )}
              <h1 className="text-3xl font-bold text-white sm:text-4xl mb-4">
                {frontmatter.title}
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-gray-300">
                {frontmatter.description}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Customer Profile Card */}
          {(frontmatter.companySize ||
            frontmatter.industry ||
            frontmatter.location) && (
            <div className="bg-gray-800 rounded-lg p-8 mb-16">
              <h2 className="text-lg font-semibold text-purple-400 mb-6">
                CUSTOMER PROFILE
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {frontmatter.companySize && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-purple-400"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-white mb-1">
                        Company size
                      </h3>
                      <p className="text-gray-400">{frontmatter.companySize}</p>
                    </div>
                  </div>
                )}
                {frontmatter.industry && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-purple-400"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M3 21H21"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M9 7H15"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M9 11H15"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M9 15H15"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-white mb-1">
                        Industry
                      </h3>
                      <p className="text-gray-400">{frontmatter.industry}</p>
                    </div>
                  </div>
                )}
                {frontmatter.location && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-purple-400"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 21C16.4183 21 20 17.4183 20 13C20 8.58172 16.4183 5 12 5C7.58172 5 4 8.58172 4 13C4 17.4183 7.58172 21 12 21Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 13H16"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 9V13"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-white mb-1">
                        Location
                      </h3>
                      <p className="text-gray-400">{frontmatter.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Key Outcomes Section */}
          {(frontmatter.developmentVelocity ||
            frontmatter.developerExperience ||
            frontmatter.leanOperations) && (
            <div className="mb-16">
              <h2 className="text-lg font-semibold text-purple-400 mb-6">
                KEY OUTCOMES
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {frontmatter.developmentVelocity && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-purple-400"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M13 10V3L4 14H11V21L20 10H13Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-white mb-1">
                        Development Velocity
                      </h3>
                      <div
                        className="text-gray-400"
                        dangerouslySetInnerHTML={{
                          __html: frontmatter.developmentVelocity,
                        }}
                      />
                    </div>
                  </div>
                )}
                {frontmatter.developerExperience && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-purple-400"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M19.4 15C19.7 14.7 20 14.2 20 13.7V10.3C20 9.8 19.7 9.3 19.4 9L16.3 6.5C15.9 6.2 15.4 6 14.9 6H9.1C8.6 6 8.1 6.2 7.7 6.5L4.6 9C4.3 9.3 4 9.8 4 10.3V13.7C4 14.2 4.3 14.7 4.6 15L7.7 17.5C8.1 17.8 8.6 18 9.1 18H14.9C15.4 18 15.9 17.8 16.3 17.5L19.4 15Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-white mb-1">
                        Developer Experience
                      </h3>
                      <div
                        className="text-gray-400"
                        dangerouslySetInnerHTML={{
                          __html: frontmatter.developerExperience,
                        }}
                      />
                    </div>
                  </div>
                )}
                {frontmatter.leanOperations && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-purple-400"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M4 6H20M4 12H20M4 18H20"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-white mb-1">
                        Lean Operations
                      </h3>
                      <div
                        className="text-gray-400"
                        dangerouslySetInnerHTML={{
                          __html: frontmatter.leanOperations,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Content */}
          <article className="prose prose-invert prose-purple max-w-none">
            {content}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
