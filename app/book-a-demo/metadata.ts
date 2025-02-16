import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Demo | Release",
  description:
    "Schedule a personalized demo to see how Release can help your team ship faster and more reliably. Our experts will show you how to get the most out of our platform.",
  openGraph: {
    title: "Book a Demo | Release",
    description:
      "Schedule a personalized demo to see how Release can help your team ship faster and more reliably. Our experts will show you how to get the most out of our platform.",
    type: "article",
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
    title: "Book a Demo | Release",
    description:
      "Schedule a personalized demo to see how Release can help your team ship faster and more reliably. Our experts will show you how to get the most out of our platform.",
    images: ["/og/og-image.png"],
    creator: "@release_hub",
  },
};
