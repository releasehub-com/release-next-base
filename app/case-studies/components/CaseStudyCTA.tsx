"use client";

import React from "react";
import Link from "next/link";

export default function CaseStudyCTA() {
  return (
    <div className="bg-gray-800 rounded-lg p-8 mt-12">
      <h2 className="text-2xl font-bold text-white mb-4">
        Ready to accelerate your development workflow?
      </h2>
      <p className="text-gray-300 mb-6">
        Join these companies and many others who are using Release to streamline
        their development process.
      </p>
      <Link
        href="https://app.release.com/signup"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        Get Started for Free
      </Link>
    </div>
  );
}
