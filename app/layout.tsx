import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Release - Faster, Cheaper DevOps. Ephemeral Environments",
  description:
    "Create, manage, and scale on-demand environments in minutes. Empower developers, reduce DevOps costs, and accelerate your development workflow with Release.com.",
  keywords:
    "ephemeral environments, development workflow, DevOps, cloud infrastructure, CI/CD, developer productivity, on-demand environments",
  openGraph: {
    title: "Release - Faster, Cheaper DevOps. Ephemeral Environments",
    description:
      "Create on-demand environments in minutes. Empower developers, reduce costs with Release.com.",
    url: "https://release.com",
    siteName: "Release.com",
    images: [
      {
        url: "https://release.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Release.com - Ephemeral Environments",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Release - Faster, Cheaper DevOps. Ephemeral Environments",
    description:
      "Create on-demand environments in minutes. Empower developers, reduce costs with Release.com.",
    images: ["https://release.com/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
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
      <body className={`${inter.className} bg-gray-900`}>{children}</body>
    </html>
  );
}
