import type { Metadata } from "next";
import StagingContent from "./components/StagingContent";

export const metadata: Metadata = {
  title: "What is a Staging Environment? | Release",
  description:
    "Learn about staging environments and why having a single staging environment may be slowing down your development process. Understand the benefits of multiple staging environments.",
  openGraph: {
    title: "What is a Staging Environment? | Release",
    description:
      "Learn about staging environments and why having a single staging environment may be slowing down your development process. Understand the benefits of multiple staging environments.",
    type: "article",
    url: "/staging-environments",
    images: [
      {
        url: "/og/staging-environments.png",
        width: 1200,
        height: 630,
        alt: "Staging Environments",
      },
    ],
    siteName: "Release",
  },
  twitter: {
    card: "summary_large_image",
    title: "What is a Staging Environment? | Release",
    description:
      "Learn about staging environments and why having a single staging environment may be slowing down your development process. Understand the benefits of multiple staging environments.",
    images: ["/og/staging-environments.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "/staging-environments",
  },
};

export default function StagingEnvironmentsPage() {
  return <StagingContent />;
}
