import { MetadataRoute } from "next";
import { parseStringPromise } from "xml2js";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface SitemapEntry {
  loc: string[];
}

interface WebflowSitemapEntry {
  loc: string[];
}

// Define all static routes in this app
const APP_ROUTES = [
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
  "partners",
  "signup",
  "company",
  "whyrelease",
  "build-vs-buy",
  "staging-environments",
  "ephemeral-environments",
  "user-acceptance-testing-with-ephemeral-environments",
  "blog",
  "case-studies",
  "book-a-demo",
  "legal/terms-of-service",
  "legal/privacy-policy",
  "legal/security",
  "terms-of-service",
  "privacy-policy",
  "security",
  "product/docker-extension",
  "product/instant-datasets",
  "product/release-delivery",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || "https://release.com";
  const webBaseUrl = "https://web.release.com";

  // Get blog posts
  const blogDirectory = path.join(process.cwd(), "app/blog/posts");
  const blogFiles = fs.readdirSync(blogDirectory);
  const blogSlugs = blogFiles
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));

  // Get case studies
  const caseStudiesDirectory = path.join(
    process.cwd(),
    "app/case-studies/content",
  );
  const caseStudyFiles = fs.existsSync(caseStudiesDirectory)
    ? fs.readdirSync(caseStudiesDirectory)
    : [];
  const caseStudySlugs = caseStudyFiles
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));

  // Get partners
  const partnersDirectory = path.join(process.cwd(), "app/partners/content");
  const partnerFiles = fs.existsSync(partnersDirectory)
    ? fs.readdirSync(partnersDirectory)
    : [];
  const partnerSlugs = partnerFiles
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));

  // Convert app routes to sitemap format
  const appRoutes = APP_ROUTES.map((route) => ({
    url: `${baseUrl}/${route}`,
    lastModified: new Date(),
  }));

  try {
    // Fetch Webflow sitemap
    const webflowResponse = await fetch(
      "https://prod.releasehub.com/sitemap.xml",
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );
    const webflowXml = await webflowResponse.text();
    const webflowData = await parseStringPromise(webflowXml);

    // Extract URLs from Webflow sitemap, excluding blog, case studies, and app routes
    const webflowUrls = webflowData.urlset.url
      .map((entry: WebflowSitemapEntry) => entry.loc[0])
      .map((url: string) => url.replace("https://release.com/", ""))
      .filter(
        (path: string) =>
          path !== "" &&
          !path.startsWith("blog/") &&
          !path.startsWith("case-studies/") &&
          path !== "blog" &&
          path !== "case-studies" &&
          !APP_ROUTES.includes(path),
      )
      .map((path) => ({
        url: `${baseUrl}/${path}`,
        lastModified: new Date(),
      }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/pricing`,
        lastModified: new Date(),
      },
      {
        url: `${webBaseUrl}/pricing`,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/case-studies`,
        lastModified: new Date(),
      },
      ...appRoutes,
      ...blogSlugs.map((slug) => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
      })),
      ...caseStudySlugs.map((slug) => ({
        url: `${baseUrl}/case-studies/${slug}`,
        lastModified: new Date(),
      })),
      ...partnerSlugs.map((slug) => ({
        url: `${baseUrl}/partners/${slug}`,
        lastModified: new Date(),
      })),
      ...webflowUrls,
    ];
  } catch (error) {
    console.error("Failed to fetch Webflow sitemap:", error);
    // If Webflow fetch fails, return just our app routes
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
      },
      {
        url: `${webBaseUrl}/pricing`,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/case-studies`,
        lastModified: new Date(),
      },
      ...appRoutes,
      ...blogSlugs.map((slug) => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
      })),
      ...caseStudySlugs.map((slug) => ({
        url: `${baseUrl}/case-studies/${slug}`,
        lastModified: new Date(),
      })),
      ...partnerSlugs.map((slug) => ({
        url: `${baseUrl}/partners/${slug}`,
        lastModified: new Date(),
      })),
    ];
  }
}
