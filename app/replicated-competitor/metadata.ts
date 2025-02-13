import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Release vs Replicated | Release",
  description:
    "Compare Release and Replicated for enterprise software delivery. See why teams choose Release for a more flexible and developer-friendly approach to software distribution.",
  openGraph: {
    title: "Release vs Replicated | Release",
    description:
      "Compare Release and Replicated for enterprise software delivery. See why teams choose Release for a more flexible and developer-friendly approach to software distribution.",
    type: "article",
    url: "/replicated-competitor",
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
    title: "Release vs Replicated | Release",
    description:
      "Compare Release and Replicated for enterprise software delivery. See why teams choose Release for a more flexible and developer-friendly approach to software distribution.",
    images: ["/og/og-image.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "/replicated-competitor",
  },
};
