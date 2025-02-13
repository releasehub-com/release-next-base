import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Release - Cloud Development Environments",
  description:
    "Spin up cloud development environments in seconds. Give your developers the tools they need to be productive without managing infrastructure.",
  openGraph: {
    title: "Release - Cloud Development Environments",
    description:
      "Spin up cloud development environments in seconds. Give your developers the tools they need to be productive without managing infrastructure.",
    type: "article",
    url: "https://release.com/cloud-development-environments",
    images: [
      {
        url: "/blog-images/hero.svg",
        width: 1200,
        height: 630,
        alt: "Release Cloud Development Environments",
      },
    ],
    siteName: "Release",
  },
  twitter: {
    card: "summary_large_image",
    title: "Release - Cloud Development Environments",
    description:
      "Spin up cloud development environments in seconds. Give your developers the tools they need to be productive without managing infrastructure.",
    images: ["/blog-images/hero.svg"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "https://release.com/cloud-development-environments",
  },
};
