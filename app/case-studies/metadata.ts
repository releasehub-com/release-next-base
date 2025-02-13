import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Case Studies | Release",
  description:
    "Discover how leading companies use Release to streamline their development workflows, improve collaboration, and ship faster with confidence.",
  openGraph: {
    title: "Customer Case Studies | Release",
    description:
      "Discover how leading companies use Release to streamline their development workflows, improve collaboration, and ship faster with confidence.",
    type: "article",
    url: "/case-studies",
    images: [
      {
        url: "/og/og-image.png",
        width: 1200,
        height: 630,
        alt: "Release - The Ephemeral Environments Platform",
      },
    ],
    siteName: "Release",
  },
  twitter: {
    card: "summary_large_image",
    title: "Customer Case Studies | Release",
    description:
      "Discover how leading companies use Release to streamline their development workflows, improve collaboration, and ship faster with confidence.",
    images: ["/og/og-image.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "/case-studies",
  },
};
