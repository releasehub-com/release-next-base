import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Company | Release",
  description:
    "Release is a team of entrepreneurs and systems engineers building efficient collaboration tools for developers. Learn more about our mission and team.",
  openGraph: {
    title: "Our Company | Release",
    description:
      "Release is a team of entrepreneurs and systems engineers building efficient collaboration tools for developers. Learn more about our mission and team.",
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
    title: "Our Company | Release",
    description:
      "Release is a team of entrepreneurs and systems engineers building efficient collaboration tools for developers. Learn more about our mission and team.",
    images: ["/og/og-image.png"],
    creator: "@release_hub",
  },
};
