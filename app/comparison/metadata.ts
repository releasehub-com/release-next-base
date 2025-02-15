import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Release | Release",
  description:
    "See how Release compares to other platforms and tools. Find out why leading teams choose Release for their environment management and deployment needs.",
  openGraph: {
    title: "Compare Release | Release",
    description:
      "See how Release compares to other platforms and tools. Find out why leading teams choose Release for their environment management and deployment needs.",
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
    title: "Compare Release | Release",
    description:
      "See how Release compares to other platforms and tools. Find out why leading teams choose Release for their environment management and deployment needs.",
    images: ["/og/og-image.png"],
    creator: "@release_hub",
  },
};
