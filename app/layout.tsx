import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import PathStorage from "./components/PathStorage";
import "highlight.js/styles/github-dark.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://release.com"),
  title: {
    default: "Release - The Ephemeral Environments Platform",
    template: "%s | Release",
  },
  description:
    "Create and manage on-demand environments in minutes. Empower developers, reduce costs, and accelerate your development workflow with Release.",
  keywords:
    "ephemeral environments, development workflow, DevOps, cloud infrastructure, CI/CD, developer productivity, on-demand environments",
  openGraph: {
    title: "Release - The Ephemeral Environments Platform",
    description:
      "Create and manage on-demand environments in minutes. Empower developers, reduce costs, and accelerate your development workflow with Release.",
    images: [
      {
        url: "/og/og-image.png",
        width: 1200,
        height: 630,
        alt: "Release Ephemeral Environments Platform",
      },
    ],
    url: "https://release.com",
    siteName: "Release",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Release - The Ephemeral Environments Platform",
    description:
      "Create and manage on-demand environments in minutes. Empower developers, reduce costs, and accelerate your development workflow with Release.",
    images: ["/og/og-image.png"],
    creator: "@release_hub",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    "max-image-preview": "large",
    "max-video-preview": -1,
    "max-snippet": -1,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
      "notranslate": true,
    },
  },
  other: {
    "google-site-verification": "your-google-verification-code",
    "yandex-verification": "your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://release.com",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const headers = () => {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains'
        },
      ],
    },
  ];
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-666482049"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-666482049');
          `}
        </Script>
        <Script
          type="text/javascript"
          id="hs-script-loader"
          strategy="afterInteractive"
          src="//js.hs-scripts.com/8047877.js"
        />
      </head>
      <body className={`${inter.className} bg-gray-900`}>
        <PathStorage />
        {children}
      </body>
    </html>
  );
}
