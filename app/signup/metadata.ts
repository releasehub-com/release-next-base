import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Release",
  description: "Get started with Release. Create your account and start building better development environments today.",
  openGraph: {
    title: "Sign Up | Release",
    description: "Get started with Release. Create your account and start building better development environments today.",
    type: "website",
    url: "https://release.com/signup",
    images: [
      {
        url: "https://release.com/og/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sign up for Release",
      },
    ],
    siteName: "Release",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up | Release",
    description: "Get started with Release. Create your account and start building better development environments today.",
    images: ["https://release.com/og/og-image.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "https://release.com/signup",
  },
}; 