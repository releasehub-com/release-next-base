import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Release - Ephemeral Environments Platform",
  description:
    "Create on-demand, production-like environments for testing, staging, and development. Eliminate environment bottlenecks and accelerate your development workflow.",
  openGraph: {
    title: "Release - Ephemeral Environments Platform",
    description:
      "Create on-demand, production-like environments for testing, staging, and development. Eliminate environment bottlenecks and accelerate your development workflow.",
    type: "article",
    url: "https://release.com/ephemeral-environments-platform",
    images: [
      {
        url: "https://release.com/og/og-image.png",
        width: 1200,
        height: 630,
        alt: "Release Ephemeral Environments Platform",
      },
    ],
    siteName: "Release",
  },
  twitter: {
    card: "summary_large_image",
    title: "Release - Ephemeral Environments Platform",
    description:
      "Create on-demand, production-like environments for testing, staging, and development. Eliminate environment bottlenecks and accelerate your development workflow.",
    images: ["https://release.com/og/og-image.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "https://release.com/ephemeral-environments-platform",
  },
};
