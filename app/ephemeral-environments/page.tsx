import type { Metadata } from "next";
import { type NextPage } from "next";
import EphemeralContent from "./components/EphemeralContent";

export const metadata: Metadata = {
  title: "What is an Ephemeral Environment? | Release",
  description:
    "Learn about ephemeral environments - temporary, production-like environments for development and testing. Understand key characteristics, benefits, and how to implement them in your workflow.",
  openGraph: {
    title: "What is an Ephemeral Environment? | Release",
    description:
      "Learn about ephemeral environments - temporary, production-like environments for development and testing. Understand key characteristics, benefits, and how to implement them in your workflow.",
    type: "article",
    url: "/ephemeral-environments",
    images: [
      {
        url: "/og/ephemeral-environments.png",
        width: 1200,
        height: 630,
        alt: "Ephemeral Environments",
      },
    ],
    siteName: "Release",
  },
  twitter: {
    card: "summary_large_image",
    title: "What is an Ephemeral Environment? | Release",
    description:
      "Learn about ephemeral environments - temporary, production-like environments for development and testing. Understand key characteristics, benefits, and how to implement them in your workflow.",
    images: ["/og/ephemeral-environments.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "/ephemeral-environments",
  },
};

const EphemeralEnvironmentsPage: NextPage = () => {
  return <EphemeralContent />;
};

export default EphemeralEnvironmentsPage;
