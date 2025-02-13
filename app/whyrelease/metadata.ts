import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why Release | Release",
  description:
    "With Release, you can build, test, and deploy applications at scale. Our Environments as a Service platform automates the process to allow your developer teams to focus on innovation and revenue.",
  openGraph: {
    title: "Why Release | Release",
    description:
      "With Release, you can build, test, and deploy applications at scale. Our Environments as a Service platform automates the process to allow your developer teams to focus on innovation and revenue.",
    type: "article",
    images: [
      {
        url: "/images/why-release-poster.png",
        width: 1200,
        height: 630,
        alt: "Release - The Ephemeral Environments Platform",
      },
    ],
    siteName: "Release",
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Release | Release",
    description:
      "With Release, you can build, test, and deploy applications at scale. Our Environments as a Service platform automates the process to allow your developer teams to focus on innovation and revenue.",
    images: ["/images/why-release-poster.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "/whyrelease",
  },
};
