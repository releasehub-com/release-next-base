import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Release Delivery - Enterprise Software Distribution | Release",
  description:
    "Ship your cloud-native applications to enterprise customers with ease. Release Delivery provides a container-based platform for deploying your software on-premises, in private clouds, or hybrid environments.",
  openGraph: {
    title: "Release Delivery - Enterprise Software Distribution | Release",
    description:
      "Ship your cloud-native applications to enterprise customers with ease. Release Delivery provides a container-based platform for deploying your software on-premises, in private clouds, or hybrid environments.",
    type: "article",
    url: "/product/release-delivery",
    images: [
      {
        url: "/images/product/release-delivery/header.svg",
        width: 1200,
        height: 630,
        alt: "Release Delivery Platform",
      },
    ],
    siteName: "Release",
  },
  twitter: {
    card: "summary_large_image",
    title: "Release Delivery - Enterprise Software Distribution | Release",
    description:
      "Ship your cloud-native applications to enterprise customers with ease. Release Delivery provides a container-based platform for deploying your software on-premises, in private clouds, or hybrid environments.",
    images: ["/images/product/release-delivery/header.svg"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "/product/release-delivery",
  },
};
