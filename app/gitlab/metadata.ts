import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitLab Integration | Release",
  description:
    "Seamlessly integrate Release with GitLab. Get production-like environments for every merge request and streamline your development workflow.",
  openGraph: {
    title: "GitLab Integration | Release",
    description:
      "Seamlessly integrate Release with GitLab. Get production-like environments for every merge request and streamline your development workflow.",
    type: "article",
    url: "https://release.com/gitlab",
    images: [
      {
        url: "https://release.com/og/og-image.png",
        width: 1200,
        height: 630,
        alt: "Release GitLab Integration",
      },
    ],
    siteName: "Release",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitLab Integration | Release",
    description:
      "Seamlessly integrate Release with GitLab. Get production-like environments for every merge request and streamline your development workflow.",
    images: ["https://release.com/og/og-image.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "https://release.com/gitlab",
  },
};
