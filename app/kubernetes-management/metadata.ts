import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Release - Kubernetes Management",
  description:
    "Simplify your Kubernetes operations with Release. Get enterprise-grade Kubernetes management without the complexity.",
  openGraph: {
    title: "Release - Kubernetes Management",
    description:
      "Simplify your Kubernetes operations with Release. Get enterprise-grade Kubernetes management without the complexity.",
    type: "article",
    url: "/kubernetes-management",
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
    title: "Release - Kubernetes Management",
    description:
      "Simplify your Kubernetes operations with Release. Get enterprise-grade Kubernetes management without the complexity.",
    images: ["/og/og-image.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "/kubernetes-management",
  },
};
