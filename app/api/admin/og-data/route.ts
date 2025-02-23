import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { parse } from "node-html-parser";

export async function GET(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get URL from query params
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // Fetch the HTML content
    const response = await fetch(url);
    const html = await response.text();
    const root = parse(html);

    // Extract OpenGraph data with fallbacks
    const ogData = {
      title: root.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
             root.querySelector('title')?.text || '',
      description: root.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                  root.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      ogImage: root.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
               root.querySelector('meta[name="twitter:image"]')?.getAttribute('content') ||
               root.querySelector('link[rel="icon"]')?.getAttribute('href') ||
               '/og/og-image.png',
      url: root.querySelector('meta[property="og:url"]')?.getAttribute('content') || url,
      type: root.querySelector('meta[property="og:type"]')?.getAttribute('content') || 'website',
      siteName: root.querySelector('meta[property="og:site_name"]')?.getAttribute('content') || '',
      twitterCard: root.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || '',
      twitterSite: root.querySelector('meta[name="twitter:site"]')?.getAttribute('content') || '',
      twitterCreator: root.querySelector('meta[name="twitter:creator"]')?.getAttribute('content') || ''
    };

    // Ensure image URL is absolute
    if (ogData.ogImage && !ogData.ogImage.startsWith('http')) {
      const baseUrl = new URL(url).origin;
      ogData.ogImage = new URL(ogData.ogImage, baseUrl).toString();
    }

    return NextResponse.json(ogData);
  } catch (error) {
    console.error('Error fetching OG data:', error);
    return NextResponse.json({ error: "Failed to fetch OpenGraph data" }, { status: 500 });
  }
} 