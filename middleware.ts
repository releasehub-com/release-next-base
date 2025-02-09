import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  VERSIONS,
  getVersionFromPath,
  isValidVersion,
  getVersionPath,
  getCanonicalVersion,
  DEFAULT_VERSION,
} from "@/config/versions";

// Get all landing paths from the versions config
const LANDING_PATHS = Object.values(VERSIONS).map(
  (v) => v.path,
) as readonly string[];

// Type guard to check if a path is a landing path
function isLandingPath(path: string): path is (typeof LANDING_PATHS)[number] {
  return LANDING_PATHS.includes(path);
}

export function middleware(request: NextRequest) {
  // Handle version parameter redirects first
  const version = request.nextUrl.searchParams.get("version");

  // Handle root path with version resolution
  if (request.nextUrl.pathname === "/") {
    // If there's a version parameter, redirect to its landing page
    if (version && isValidVersion(version)) {
      const canonicalVersion = getCanonicalVersion(version);
      const redirectPath = getVersionPath(canonicalVersion);

      const url = request.nextUrl.clone();
      url.pathname = redirectPath;
      url.searchParams.delete("version");
      return NextResponse.redirect(url);
    }

    // Otherwise, check for stored version in cookie
    const storedVersion = request.cookies.get("landing_version")?.value;
    if (storedVersion && isValidVersion(storedVersion)) {
      const canonicalVersion = getCanonicalVersion(storedVersion);
      const redirectPath = getVersionPath(canonicalVersion);
      
      const url = request.nextUrl.clone();
      url.pathname = redirectPath;
      return NextResponse.redirect(url);
    }

    // If no stored version, redirect to default version's landing page
    const defaultPath = getVersionPath(DEFAULT_VERSION);
    if (defaultPath !== "/") {
      const url = request.nextUrl.clone();
      url.pathname = defaultPath;
      return NextResponse.redirect(url);
    }
  }

  // Handle landing pages
  if (isLandingPath(request.nextUrl.pathname)) {
    const response = NextResponse.next();
    const version = getVersionFromPath(request.nextUrl.pathname);
    response.cookies.set("landing_version", version, {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/ephemeral-environments-platform",
    "/gitlab-integration",
    "/kubernetes-management",
    "/replicated",
    "/cloud-development-environments",
    "/platform-as-a-service",
    "/comparison",
    "/comparison/gitlab",
    "/comparison/signadot",
    "/comparison/bunnyshell",
    "/comparison/qovery",
    "/comparison/shipyard",
    "/partners",
    "/signup",
    "/sitemap.xml",
  ],
};
