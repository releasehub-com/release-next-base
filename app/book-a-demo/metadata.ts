import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Demo | Release",
  description:
    "Book a demo with Release to learn how we can help your team ship better apps faster.",
  openGraph: {
    title: "Book a Demo | Release",
    description:
      "Schedule a personalized demo to see how Release can help streamline your development workflow with ephemeral environments.",
    type: "article",
    url: "https://release.com/book-a-demo",
    images: [
      {
        url: "https://release.com/og/book-a-demo.png",
        width: 1200,
        height: 630,
        alt: "Book a Demo with Release",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Demo | Release",
    description:
      "Schedule a personalized demo to see how Release can help streamline your development workflow with ephemeral environments.",
    images: ["https://release.com/og/book-a-demo.png"],
  },
  alternates: {
    canonical: "https://release.com/book-a-demo",
  },
};
