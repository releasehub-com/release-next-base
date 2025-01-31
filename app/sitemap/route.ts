import { parseStringPromise } from "xml2js";
import { NextResponse } from "next/server";

interface SitemapEntry {
  loc: string[];
}

export async function GET() {
  const baseUrl = "https://release.com";

  // Our app's routes
  const appRoutes = [
    "ephemeral-environments-platform",
    "gitlab-competitor",
    "kubernetes-management",
    "replicated-competitor",
    "cloud-development-environments",
    "heroku-competitor",
    "platform-as-a-service",
    "comparison",
    "comparison/gitlab",
    "comparison/signadot",
    "comparison/bunnyshell",
    "comparison/qovery",
    "comparison/shipyard",
  ];

  try {
    // Fetch Webflow sitemap
    const webflowSitemap = await fetch(
      "https://prod.releasehub.com/sitemap.xml",
      { next: { revalidate: 3600 } },
    );
    const webflowXml = await webflowSitemap.text();
    const webflowData = await parseStringPromise(webflowXml);

    // Extract all URLs from Webflow sitemap
    const webflowUrls = webflowData.urlset.url
      .map((entry: SitemapEntry) => entry.loc[0])
      .map((url: string) => url.replace("https://release.com/", ""))
      .filter((path: string) => path !== "");

    // Combine all routes using Array.from
    const allRoutes = Array.from(new Set([...webflowUrls, ...appRoutes]));

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allRoutes
        .map(
          (route) => `
        <url>
          <loc>${baseUrl}/${route}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>${route === "" ? "1.0" : "0.8"}</priority>
        </url>
      `,
        )
        .join("")}
    </urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Failed to fetch Webflow sitemap:", error);

    // If fetching fails, return sitemap with just our app routes
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${appRoutes
        .map(
          (route) => `
        <url>
          <loc>${baseUrl}/${route}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>${route === "" ? "1.0" : "0.8"}</priority>
        </url>
      `,
        )
        .join("")}
    </urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }
}
