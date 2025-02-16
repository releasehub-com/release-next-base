import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "GitLab Integration | Release",
  description:
    "Seamlessly integrate Release with GitLab. Get production-like environments for every merge request and streamline your development workflow.",
  openGraph: {
    title: "GitLab Integration | Release",
    description:
      "Seamlessly integrate Release with GitLab. Get production-like environments for every merge request and streamline your development workflow.",
    type: "article",
    images: [
      {
        url: "/blog-images/hero.svg",
        width: 1200,
        height: 630,
        alt: "Release - The Ephemeral Environments Platform",
      },
    ],
    siteName: "Release",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitLab Integration | Release",
    description:
      "Seamlessly integrate Release with GitLab. Get production-like environments for every merge request and streamline your development workflow.",
    images: ["/og/og-image.png"],
    creator: "@release_hub",
  },
};
