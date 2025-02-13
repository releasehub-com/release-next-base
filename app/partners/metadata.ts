import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Program | Release",
  description: "Join the Release Partner Program to help your clients accelerate their development workflows with ephemeral environments and modern cloud infrastructure.",
  openGraph: {
    title: "Partner Program | Release",
    description: "Join the Release Partner Program to help your clients accelerate their development workflows with ephemeral environments and modern cloud infrastructure.",
    type: "article",
    url: "https://release.com/partners",
    images: [
      {
        url: "https://release.com/og/og-image.png",
        width: 1200,
        height: 630,
        alt: "Release Partner Program",
      },
    ],
    siteName: "Release",
  },
  twitter: {
    card: "summary_large_image",
    title: "Partner Program | Release",
    description: "Join the Release Partner Program to help your clients accelerate their development workflows with ephemeral environments and modern cloud infrastructure.",
    images: ["https://release.com/og/og-image.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "https://release.com/partners",
  },
}; 