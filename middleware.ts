import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Add pathname to headers for layout detection
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // For non-admin routes, just pass through with the pathname header
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Allow access to login page
  if (pathname === '/admin/login') {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Check for auth token
  const token = await getToken({ req: request });
  
  // If no token or not admin, redirect to login
  if (!token?.isAdmin) {
    const loginUrl = new URL('/admin/login', request.url);
    // Preserve the original URL as callback URL
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Only match admin routes and root for pathname detection
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
