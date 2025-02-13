import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Replicated Integration | Release",
  description:
    "Integrate Release with Replicated to streamline your enterprise software delivery. Deploy and manage your applications with confidence.",
  openGraph: {
    title: "Replicated Integration | Release",
    description:
      "Integrate Release with Replicated to streamline your enterprise software delivery. Deploy and manage your applications with confidence.",
    type: "article",
    url: "/replicated",
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
    title: "Replicated Integration | Release",
    description:
      "Integrate Release with Replicated to streamline your enterprise software delivery. Deploy and manage your applications with confidence.",
    images: ["/og/og-image.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "/replicated",
  },
};
