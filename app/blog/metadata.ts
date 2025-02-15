import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Release",
  description:
    "Insights, tutorials, and updates from the Release team about ephemeral environments, cloud infrastructure, and modern development practices.",
  openGraph: {
    title: "Release Blog",
    description:
      "Insights, tutorials, and updates from the Release team about ephemeral environments, cloud infrastructure, and modern development practices.",
    type: "article",
    images: [
      {
        url: "/og/og-image.png",
        width: 1200,
        height: 630,
        alt: "Release Blog",
      },
    ],
    siteName: "Release",
  },
  twitter: {
    card: "summary_large_image",
    title: "Release Blog",
    description:
      "Insights, tutorials, and updates from the Release team about ephemeral environments, cloud infrastructure, and modern development practices.",
    images: ["/og/og-image.png"],
    creator: "@release_hub",
  },
};
