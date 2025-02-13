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
  // Create base response
  const response = NextResponse.next();

  // Add security headers to all responses
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  // Allow framing only from same origin
  response.headers.set("X-Frame-Options", "SAMEORIGIN");

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
    const version = getVersionFromPath(request.nextUrl.pathname);
    response.cookies.set("landing_version", version, {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
