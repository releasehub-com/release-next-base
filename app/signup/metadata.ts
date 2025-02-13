import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Release",
  description:
    "Get started with Release. Create your account and start building better development environments today.",
  openGraph: {
    title: "Sign Up | Release",
    description:
      "Get started with Release. Create your account and start building better development environments today.",
    type: "website",
    url: "/signup",
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
    title: "Sign Up | Release",
    description:
      "Get started with Release. Create your account and start building better development environments today.",
    images: ["/og/og-image.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "/signup",
  },
};
