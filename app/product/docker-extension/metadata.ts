import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Release Share Docker Extension | Release",
  description:
    "Instantly share local containers with customizable URLs. Test, preview, and QA earlier and faster throughout the SDLC.",
  openGraph: {
    title: "Release Share Docker Extension | Release",
    description:
      "Instantly share local containers with customizable URLs. Test, preview, and QA earlier and faster throughout the SDLC.",
    type: "article",
    url: "/product/docker-extension",
    images: [
      {
        url: "/images/product/docker-extension/header.svg",
        width: 2000,
        height: 1500,
        alt: "Release Share Docker Extension Interface",
      },
    ],
    siteName: "Release",
  },
  twitter: {
    card: "summary_large_image",
    title: "Release Share Docker Extension | Release",
    description:
      "Instantly share local containers with customizable URLs. Test, preview, and QA earlier and faster throughout the SDLC.",
    images: ["/images/product/docker-extension/header.svg"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "/product/docker-extension",
  },
};
