import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build vs Buy: Environment Management | Release",
  description:
    "Explore the tradeoffs between building your own environment management solution versus buying a solution like Release. Learn about the costs, benefits, and considerations for each approach.",
  openGraph: {
    title: "Build vs Buy: Environment Management | Release",
    description:
      "Explore the tradeoffs between building your own environment management solution versus buying a solution like Release. Learn about the costs, benefits, and considerations for each approach.",
    type: "article",
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
    title: "Build vs Buy: Environment Management | Release",
    description:
      "Explore the tradeoffs between building your own environment management solution versus buying a solution like Release. Learn about the costs, benefits, and considerations for each approach.",
    images: ["/og/og-image.png"],
    creator: "@release_hub",
  },
};
