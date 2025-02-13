import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Release - Platform as a Service",
  description: "A modern Platform as a Service (PaaS) that gives you complete control over your infrastructure while maintaining the developer experience you love.",
  openGraph: {
    title: "Release - Platform as a Service",
    description: "A modern Platform as a Service (PaaS) that gives you complete control over your infrastructure while maintaining the developer experience you love.",
    type: "article",
    url: "https://release.com/platform-as-a-service",
    images: [
      {
        url: "/blog-images/hero.svg",
        width: 1200,
        height: 630,
        alt: "Release Platform as a Service",
      },
    ],
    siteName: "Release",
  },
  twitter: {
    card: "summary_large_image",
    title: "Release - Platform as a Service",
    description: "A modern Platform as a Service (PaaS) that gives you complete control over your infrastructure while maintaining the developer experience you love.",
    images: ["/blog-images/hero.svg"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "https://release.com/platform-as-a-service",
  },
}; 