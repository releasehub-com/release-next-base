import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staging Environments | Release",
  description:
    "Create production-like staging environments on demand. Test your applications in isolated environments that perfectly mirror your production setup.",
  openGraph: {
    title: "Staging Environments | Release",
    description:
      "Create production-like staging environments on demand. Test your applications in isolated environments that perfectly mirror your production setup.",
    type: "article",
    url: "/staging-environments",
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
    title: "Staging Environments | Release",
    description:
      "Create production-like staging environments on demand. Test your applications in isolated environments that perfectly mirror your production setup.",
    images: ["/og/og-image.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "/staging-environments",
  },
};
