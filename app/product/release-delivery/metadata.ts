import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Release Delivery | Release",
  description:
    "Automate your software delivery with Release Delivery. Deploy faster and more reliably with automated pipelines, infrastructure as code, and comprehensive testing.",
  openGraph: {
    title: "Release Delivery | Release",
    description:
      "Automate your software delivery with Release Delivery. Deploy faster and more reliably with automated pipelines, infrastructure as code, and comprehensive testing.",
    type: "article",
    url: "https://release.com/product/release-delivery",
    images: [
      {
        url: "https://release.com/images/product/release-delivery/header.svg",
        width: 2000,
        height: 1500,
        alt: "Release Delivery Platform Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Release Delivery | Release",
    description:
      "Automate your software delivery with Release Delivery. Deploy faster and more reliably with automated pipelines, infrastructure as code, and comprehensive testing.",
    images: ["https://release.com/images/product/release-delivery/header.svg"],
  },
  alternates: {
    canonical: "https://release.com/product/release-delivery",
  },
};
