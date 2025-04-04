"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CaseStudy } from "../types";

interface CaseStudyIndexProps {
  caseStudies: CaseStudy[];
}

export default function CaseStudyIndex({ caseStudies }: CaseStudyIndexProps) {
  return (
    <main className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-12">Case Studies</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study) => (
            <Link
              key={study.slug}
              href={`/case-studies/${study.slug}`}
              className="group"
            >
              <article className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors h-full">
                {study.frontmatter.thumbnail && (
                  <div className="relative h-48">
                    <Image
                      src={study.frontmatter.thumbnail}
                      alt={study.frontmatter.title}
                      fill
                      className="object-cover"
                      unoptimized={study.frontmatter.thumbnail.endsWith(".svg")}
                    />
                  </div>
                )}
                <div className="p-6">
                  {study.frontmatter.logo && (
                    <div className="h-8 mb-4">
                      <Image
                        src={study.frontmatter.logo}
                        alt={`${study.frontmatter.title} logo`}
                        width={120}
                        height={32}
                        className="object-contain brightness-0 invert"
                        unoptimized={study.frontmatter.logo.endsWith(".svg")}
                      />
                    </div>
                  )}
                  <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors mb-2">
                    {study.frontmatter.title}
                  </h2>
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {study.frontmatter.description}
                  </p>
                  {study.frontmatter.industry && (
                    <p className="text-sm text-gray-500">
                      Industry: {study.frontmatter.industry}
                    </p>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
