import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Release - GitLab Integration",
  description:
    "Seamlessly integrate Release with GitLab. Automate your deployment workflow and get production-like environments for every merge request.",
  openGraph: {
    title: "Release - GitLab Integration",
    description:
      "Seamlessly integrate Release with GitLab. Automate your deployment workflow and get production-like environments for every merge request.",
    type: "article",
    url: "https://release.com/gitlab-integration",
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
    title: "Release - GitLab Integration",
    description:
      "Seamlessly integrate Release with GitLab. Automate your deployment workflow and get production-like environments for every merge request.",
    images: ["https://release.com/og/og-image.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "https://release.com/gitlab-integration",
  },
};
