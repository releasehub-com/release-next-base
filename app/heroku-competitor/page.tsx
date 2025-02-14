import type { Metadata } from "next";
import HerokuRedirectContent from "./components/HerokuRedirectContent";

export const metadata: Metadata = {
  title: "Heroku Alternative | Release",
  description:
    "Looking for a Heroku alternative? Release offers a modern Platform as a Service (PaaS) with complete control over your infrastructure while maintaining the developer experience you love.",
  openGraph: {
    title: "Heroku Alternative | Release",
    description:
      "Looking for a Heroku alternative? Release offers a modern Platform as a Service (PaaS) with complete control over your infrastructure while maintaining the developer experience you love.",
    type: "article",
    url: "/heroku-competitor",
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
    title: "Heroku Alternative | Release",
    description:
      "Looking for a Heroku alternative? Release offers a modern Platform as a Service (PaaS) with complete control over your infrastructure while maintaining the developer experience you love.",
    images: ["/og/og-image.png"],
    creator: "@release_hub",
  },
  alternates: {
    canonical: "/platform-as-a-service",
  },
};

export default function HerokuCompetitorPage() {
  return <HerokuRedirectContent />;
}
