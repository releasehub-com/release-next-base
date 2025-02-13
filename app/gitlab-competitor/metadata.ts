import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Release vs GitLab | Release",
  description:
    "Compare Release and GitLab for environment management and deployment automation. See why teams choose Release for a more streamlined development workflow.",
  openGraph: {
    title: "Release vs GitLab | Release",
    description:
      "Compare Release and GitLab for environment management and deployment automation. See why teams choose Release for a more streamlined development workflow.",
    type: "article",
    url: "/gitlab-competitor",
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
    title: "Release vs GitLab | Release",
    description:
      "Compare Release and GitLab for environment management and deployment automation. See why teams choose Release for a more streamlined development workflow.",
    images: ["/og/og-image.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "/gitlab-competitor",
  },
};
