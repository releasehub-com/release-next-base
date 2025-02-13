import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform as a Service | Release",
  description:
    "A modern Platform as a Service (PaaS) that gives you complete control over your infrastructure while maintaining the developer experience you love.",
  openGraph: {
    title: "Platform as a Service | Release",
    description:
      "A modern Platform as a Service (PaaS) that gives you complete control over your infrastructure while maintaining the developer experience you love.",
    type: "article",
    url: "/paas",
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
    title: "Platform as a Service | Release",
    description:
      "A modern Platform as a Service (PaaS) that gives you complete control over your infrastructure while maintaining the developer experience you love.",
    images: ["/og/og-image.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "/platform-as-a-service",
  },
};
