import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Release - The Ephemeral Environments Platform",
  description: "Create and manage on-demand environments in minutes. Empower developers, reduce costs, and accelerate your development workflow with Release.",
  openGraph: {
    title: "Release - The Ephemeral Environments Platform",
    description: "Create and manage on-demand environments in minutes. Empower developers, reduce costs, and accelerate your development workflow with Release.",
    type: "website",
    url: "https://release.com",
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
    title: "Release - The Ephemeral Environments Platform",
    description: "Create and manage on-demand environments in minutes. Empower developers, reduce costs, and accelerate your development workflow with Release.",
    images: ["https://release.com/og/og-image.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "https://release.com",
  },
}; 