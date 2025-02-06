import { MetadataRoute } from "next";
import { parseStringPromise } from "xml2js";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface SitemapEntry {
  loc: string[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://release.com";

  // Core application routes that we manage
  const appRoutes = [
    "",
    "gitlab",
    "gitlab-competitor",
    "kubernetes-management",
    "replicated-competitor",
    "cloud-development-environments",
    "platform-as-a-service",
    "ephemeral-environments-platform",
  ];

  // Get blog posts from MDX files
  const postsDirectory = path.join(process.cwd(), "app/blog/posts");
  const blogPosts = fs
    .readdirSync(postsDirectory)
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContent);

      return {
        slug: filename.replace(".mdx", ""),
        publishDate: data.publishDate,
      };
    });

  try {
    // Fetch Webflow sitemap
    const webflowSitemap = await fetch(
      "https://prod.releasehub.com/sitemap.xml",
    );
    const webflowXml = await webflowSitemap.text();
    const webflowData = await parseStringPromise(webflowXml);

    // Extract URLs from Webflow sitemap, excluding blog posts
    const webflowUrls = webflowData.urlset.url
      .map((entry: SitemapEntry) => entry.loc[0])
      .map((url: string) => url.replace("https://release.com/", ""))
      .filter(
        (path: string) =>
          path !== "" &&
          !path.startsWith("blog/") && // Exclude blog posts
          path !== "blog", // Exclude blog index
      );

    // Generate sitemap entries
    const entries: MetadataRoute.Sitemap = [
      // Webflow routes
      ...webflowUrls.map((route) => ({
        url: `${baseUrl}/${route}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),

      // App routes
      ...appRoutes.map((route) => ({
        url: `${baseUrl}/${route}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: route === "" ? 1 : 0.8,
      })),

      // Blog index
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },

      // Blog posts
      ...blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.publishDate),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ];

    return entries;
  } catch (error) {
    console.error("Failed to fetch Webflow sitemap:", error);

    // If fetching fails, return app routes and blog posts
    return [
      ...appRoutes.map((route) => ({
        url: `${baseUrl}/${route}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: route === "" ? 1 : 0.8,
      })),
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
      ...blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.publishDate),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ];
  }
}
