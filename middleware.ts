import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const version = searchParams.get("version");

  if (version) {
    // Map old version parameters to new slugs
    const versionToSlug: { [key: string]: string } = {
      gitlab: "/gitlab-competitor",
      kubernetes: "/kubernetes-management",
      k8s: "/kubernetes-management",
      replicated: "/replicated-competitor",
      "cloud-dev": "/cloud-development-environments",
      heroku: "/platform-as-a-service",
      paas: "/platform-as-a-service",
      ephemeral: "/ephemeral-environments-platform",
      regular: "/ephemeral-environments-platform",
    };

    const newPath = versionToSlug[version];
    if (newPath) {
      // Create new URL with the path but without the version parameter
      const url = request.nextUrl.clone();
      url.pathname = newPath;
      url.searchParams.delete("version");

      return NextResponse.redirect(url);
    }
  }

  // For sitemap.xml, serve our app's sitemap for search engines
  // but redirect users to Webflow's sitemap
  if (request.nextUrl.pathname === "/sitemap.xml") {
    const userAgent = request.headers.get("user-agent") || "";
    const isSearchEngine = /bot|crawler|spider|googlebot/i.test(userAgent);

    if (isSearchEngine) {
      // Let Next.js handle it with our app/sitemap.ts
      return NextResponse.next();
    }

    // Redirect human users to Webflow sitemap
    return NextResponse.redirect("https://prod.releasehub.com/sitemap.xml", {
      status: 301,
    });
  }

  return NextResponse.next();
}

// Only run middleware on pages with version parameter
export const config = {
  matcher: "/",
};
