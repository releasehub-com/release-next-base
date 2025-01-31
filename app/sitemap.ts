import { MetadataRoute } from "next";
import { parseStringPromise } from "xml2js";

interface SitemapEntry {
  loc: string[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://release.com";

  // Existing routes from current sitemap
  const existingRoutes = [
    "",
    "blog",
    "build-vs-buy",
    "company",
    "dzone-report",
    "ephemeral-environments",
    "privacy-policy",
    "private-apps-landing",
    "staging-environments",
    "terms-of-service",
    "thank-you",
    "use-cases",
    "user-acceptance-testing-with-ephemeral-environments",
    "whitepaper-pdf",
    "whitepapers",
    "ebooks",
    "case-studies",
    "kubecon",
    "book-a-demo",
    "webinar-on-demand",
    "press-releases",
    "whyrelease",
    "pricing",
    "security",
    "start",
    "releaselog",
    "releaselog/2",
    "webinar/improving-app-delivery-team-outcomes-webinar",
    "webinar/full-fidelity-data-for-ephemeral-environments",
    "dzone/demo",
    "dzone/download",
    "releaselogs/changelog",
    "releaselogs/changelog-2",
    "releaselogs/changelog-3",
    "releaselogs/changelog-4",
    "releaselogs/changelog-oct-23-nov-6-2022",
    "releaselogs/changelog-nov-7-nov-20-2022",
    "releaselogs/changelog-nov-21-dec-18-2022",
    "casestudy/monad",
    "casestudy/simon",
    "casestudy/mosaic",
    "casestudy/datasaurai",
    "casestudy/noteable",
    "casestudy/chipper-cash",
    "usecase/on-demand-ephemeral-staging-environments",
    "usecase/sales-demo-environments",
    "usecase/migration-test-environments",
    "usecase/unlimited-qa-validation-environments",
    "usecase/deploy-automated-preview-environments",
    "usecase/performance-test-environments",
    "usecase/dev-sandbox-r-d-playground",
    "usecase/running-your-production-environments",
    "whitepaper/easy-environments-management",
    "whitepaper/aws-releasehub-for-you",
    "ebook/the-complete-guide-to-automated-software-environments",
  ];

  // New landing pages
  const newLandingRoutes = [
    "ephemeral-environments-platform",
    "gitlab-competitor",
    "kubernetes-management",
    "replicated-competitor",
    "cloud-development-environments",
    "heroku-competitor",
    "platform-as-a-service",
  ];

  // Comparison pages
  const comparisonRoutes = [
    "comparison",
    "comparison/gitlab",
    "comparison/signadot",
    "comparison/bunnyshell",
    "comparison/qovery",
    "comparison/shipyard",
  ];

  // Our app's routes
  const appRoutes = [...newLandingRoutes, ...comparisonRoutes];

  try {
    // Fetch Webflow sitemap
    const webflowSitemap = await fetch(
      "https://prod.releasehub.com/sitemap.xml",
    );
    const webflowXml = await webflowSitemap.text();
    const webflowData = await parseStringPromise(webflowXml);

    // Extract all URLs from Webflow sitemap
    const webflowUrls = webflowData.urlset.url
      .map((entry: SitemapEntry) => entry.loc[0])
      .map((url: string) => url.replace("https://release.com/", ""))
      .filter((path: string) => path !== ""); // Remove empty paths

    // Combine all routes using Array.from instead of spread operator
    const allRoutes = Array.from(new Set([...webflowUrls, ...appRoutes]));

    return allRoutes.map((route) => ({
      url: `${baseUrl}/${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1 : 0.8,
    }));
  } catch (error) {
    console.error("Failed to fetch Webflow sitemap:", error);

    // If fetching fails, at least return our app routes
    return appRoutes.map((route) => ({
      url: `${baseUrl}/${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1 : 0.8,
    }));
  }
}
