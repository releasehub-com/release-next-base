import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  VERSIONS,
  getVersionFromPath,
  isValidVersion,
  getVersionPath,
  getCanonicalVersion,
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

  // Only redirect version params on the root path
  if (version && isValidVersion(version) && request.nextUrl.pathname === "/") {
    const canonicalVersion = getCanonicalVersion(version);
    const redirectPath = getVersionPath(canonicalVersion);

    const url = request.nextUrl.clone();
    url.pathname = redirectPath;
    url.searchParams.delete("version");
    return NextResponse.redirect(url);
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
