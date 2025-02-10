import fs from "fs";
import path from "path";
import { Builder } from "xml2js";
import { parseStringPromise } from "xml2js";

interface SitemapURL {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

interface Sitemap {
  urlset: {
    $: { xmlns: string };
    url: SitemapURL[];
  };
}

interface WebflowSitemapEntry {
  loc: string[];
}

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
];

const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || "https://release.com";
const webBaseUrl = "https://web.release.com";

async function generateSitemap(): Promise<void> {
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

  const today = new Date().toISOString().split("T")[0];

  try {
    // Fetch Webflow sitemap
    const webflowResponse = await fetch(
      "https://prod.releasehub.com/sitemap.xml",
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
      );

    const sitemap: Sitemap = {
      urlset: {
        $: {
          xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
        },
        url: [
          {
            loc: baseUrl,
            lastmod: today,
            changefreq: "daily",
            priority: "1.0",
          },
          {
            loc: `${baseUrl}/pricing`,
            lastmod: today,
            changefreq: "daily",
            priority: "0.8",
          },
          {
            loc: `${webBaseUrl}/pricing`,
            lastmod: today,
            changefreq: "daily",
            priority: "0.8",
          },
          {
            loc: `${baseUrl}/blog`,
            lastmod: today,
            changefreq: "daily",
            priority: "0.8",
          },
          {
            loc: `${baseUrl}/case-studies`,
            lastmod: today,
            changefreq: "daily",
            priority: "0.8",
          },
          // Add app routes
          ...APP_ROUTES.map((route) => ({
            loc: `${baseUrl}/${route}`,
            lastmod: today,
            changefreq: "daily",
            priority: "0.8",
          })),
          // Add blog posts
          ...blogSlugs.map((slug) => ({
            loc: `${baseUrl}/blog/${slug}`,
            lastmod: today,
            changefreq: "weekly",
            priority: "0.7",
          })),
          // Add case studies
          ...caseStudySlugs.map((slug) => ({
            loc: `${baseUrl}/case-studies/${slug}`,
            lastmod: today,
            changefreq: "weekly",
            priority: "0.7",
          })),
          // Add partners
          ...partnerSlugs.map((slug) => ({
            loc: `${baseUrl}/partners/${slug}`,
            lastmod: today,
            changefreq: "weekly",
            priority: "0.7",
          })),
          // Add Webflow URLs
          ...webflowUrls.map((path) => ({
            loc: `${baseUrl}/${path}`,
            lastmod: today,
            changefreq: "daily",
            priority: "0.8",
          })),
        ],
      },
    };

    const builder = new Builder();
    const xml = builder.buildObject(sitemap);

    fs.writeFileSync("public/sitemap.xml", xml);
    console.log("Sitemap generated successfully!");
  } catch (error) {
    console.error("Failed to fetch Webflow sitemap:", error);
    // If Webflow fetch fails, generate sitemap with just our routes
    const sitemap: Sitemap = {
      urlset: {
        $: {
          xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
        },
        url: [
          {
            loc: baseUrl,
            lastmod: today,
            changefreq: "daily",
            priority: "1.0",
          },
          {
            loc: `${baseUrl}/pricing`,
            lastmod: today,
            changefreq: "daily",
            priority: "0.8",
          },
          {
            loc: `${webBaseUrl}/pricing`,
            lastmod: today,
            changefreq: "daily",
            priority: "0.8",
          },
          {
            loc: `${baseUrl}/blog`,
            lastmod: today,
            changefreq: "daily",
            priority: "0.8",
          },
          {
            loc: `${baseUrl}/case-studies`,
            lastmod: today,
            changefreq: "daily",
            priority: "0.8",
          },
          ...APP_ROUTES.map((route) => ({
            loc: `${baseUrl}/${route}`,
            lastmod: today,
            changefreq: "daily",
            priority: "0.8",
          })),
          ...blogSlugs.map((slug) => ({
            loc: `${baseUrl}/blog/${slug}`,
            lastmod: today,
            changefreq: "weekly",
            priority: "0.7",
          })),
          ...caseStudySlugs.map((slug) => ({
            loc: `${baseUrl}/case-studies/${slug}`,
            lastmod: today,
            changefreq: "weekly",
            priority: "0.7",
          })),
          ...partnerSlugs.map((slug) => ({
            loc: `${baseUrl}/partners/${slug}`,
            lastmod: today,
            changefreq: "weekly",
            priority: "0.7",
          })),
        ],
      },
    };

    const builder = new Builder();
    const xml = builder.buildObject(sitemap);

    fs.writeFileSync("public/sitemap.xml", xml);
    console.log(
      "Sitemap generated with app routes only (Webflow fetch failed)",
    );
  }
}

generateSitemap().catch(console.error);
