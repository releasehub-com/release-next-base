import type { Metadata } from "next";
import WhyReleaseContent from "./components/WhyReleaseContent";

export const metadata: Metadata = {
  title: "Why Release | Release",
  description:
    "With Release, you can build, test, and deploy applications at scale. Our Environments as a Service platform automates the process to allow your developer teams to focus on innovation and revenue.",
  openGraph: {
    title: "Why Release | Release",
    description:
      "With Release, you can build, test, and deploy applications at scale. Our Environments as a Service platform automates the process to allow your developer teams to focus on innovation and revenue.",
    type: "article",
    url: "/whyrelease",
    images: [
      {
        url: "/og/why-release.png",
        width: 1200,
        height: 630,
        alt: "Why Release",
      },
    ],
    siteName: "Release",
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Release | Release",
    description:
      "With Release, you can build, test, and deploy applications at scale. Our Environments as a Service platform automates the process to allow your developer teams to focus on innovation and revenue.",
    images: ["/og/why-release.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "/whyrelease",
  },
};

export default function WhyReleasePage() {
  return <WhyReleaseContent />;
}
