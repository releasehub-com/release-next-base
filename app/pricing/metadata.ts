import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Release - Pricing",
  description:
    "Simple, transparent pricing for teams of all sizes. Start for free and scale as you grow.",
  openGraph: {
    title: "Release - Pricing",
    description:
      "Simple, transparent pricing for teams of all sizes. Start for free and scale as you grow.",
    type: "article",
    url: "/pricing",
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
    title: "Release - Pricing",
    description:
      "Simple, transparent pricing for teams of all sizes. Start for free and scale as you grow.",
    images: ["/og/og-image.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "/pricing",
  },
};
