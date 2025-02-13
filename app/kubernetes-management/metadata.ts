import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Release - Kubernetes Management",
  description: "Simplify your Kubernetes operations with Release. Get enterprise-grade Kubernetes management without the complexity.",
  openGraph: {
    title: "Release - Kubernetes Management",
    description: "Simplify your Kubernetes operations with Release. Get enterprise-grade Kubernetes management without the complexity.",
    type: "article",
    url: "https://release.com/kubernetes-management",
    images: [
      {
        url: "https://release.com/og/og-image.png",
        width: 1200,
        height: 630,
        alt: "Release Kubernetes Management",
      },
    ],
    siteName: "Release",
  },
  twitter: {
    card: "summary_large_image",
    title: "Release - Kubernetes Management",
    description: "Simplify your Kubernetes operations with Release. Get enterprise-grade Kubernetes management without the complexity.",
    images: ["https://release.com/og/og-image.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "https://release.com/kubernetes-management",
  },
}; 