import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docker Extension | Release",
  description:
    "Enhance your Docker development workflow with the Release Docker Extension. Manage environments and deployments directly from Docker Desktop.",
  openGraph: {
    title: "Docker Extension | Release",
    description:
      "Enhance your Docker development workflow with the Release Docker Extension. Manage environments and deployments directly from Docker Desktop.",
    type: "article",
    url: "/product/docker-extension",
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
    title: "Docker Extension | Release",
    description:
      "Enhance your Docker development workflow with the Release Docker Extension. Manage environments and deployments directly from Docker Desktop.",
    images: ["/og/og-image.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "/product/docker-extension",
  },
};
