import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://release.com";

interface MetadataOptions {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  type?: "website" | "article";
}

export function generateMetadata({
  title,
  description,
  path,
  ogImage = "/og/og-image.png",
  type = "website",
}: MetadataOptions): Metadata {
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Ensure ogImage starts with a slash
  const normalizedOgImage = ogImage.startsWith("/") ? ogImage : `/${ogImage}`;

  return {
    title: `${title} | Release`,
    description,
    openGraph: {
      title: `${title} | Release`,
      description,
      type,
      images: [
        {
          url: `${baseUrl}${normalizedOgImage}`,
          width: 1200,
          height: 630,
          alt: "Release - The Ephemeral Environments Platform",
        },
      ],
      siteName: "Release",
      url: `${baseUrl}${normalizedPath}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Release`,
      description,
      images: [`${baseUrl}${normalizedOgImage}`],
      creator: "@release_hub",
    },
    alternates: {
      canonical: `${baseUrl}${normalizedPath}`,
    },
  };
}
