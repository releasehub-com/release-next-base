import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// List of paths that should not have the admin layout
const NO_ADMIN_LAYOUT_PATHS = ['/admin/login'];

// List of paths that should be publicly accessible
const PUBLIC_PATHS = [
  '/admin/login',
  '/api/auth/callback/google',
  '/api/auth/signin/google',
  '/api/auth/signin',
  '/api/auth/session',
  '/api/auth/csrf',
  '/api/auth/providers'
];

// Middleware function that runs before withAuth
function addHeaders(request: Request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export default withAuth(
  function middleware(req) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-url', req.url);

    // Set a header to indicate whether to show admin layout
    requestHeaders.set('x-show-admin-layout', 
      !NO_ADMIN_LAYOUT_PATHS.includes(req.nextUrl.pathname) ? '1' : '0'
    );
    
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Always allow auth-related paths
    if (path.startsWith('/api/auth/')) {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    // If we have a valid admin token
    if (token?.isAdmin) {
      // Redirect from login to admin if already authenticated
      if (path === '/admin/login') {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      // Allow access to all admin routes
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    // If not authenticated or not admin
    if (path.startsWith('/admin') && path !== '/admin/login') {
      // Store the original URL as the callback URL
      const callbackUrl = encodeURIComponent(req.url);
      return NextResponse.redirect(
        new URL(`/admin/login?callbackUrl=${callbackUrl}`, req.url)
      );
    }

    // For all other cases, continue with added headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Always allow auth-related paths
        if (path.startsWith('/api/auth/')) {
          return true;
        }

        // Allow access to login page
        if (path === '/admin/login') {
          return true;
        }

        // For admin routes, require admin token
        if (path.startsWith('/admin')) {
          return Boolean(token?.isAdmin);
        }

        return true;
      }
    }
  }
);

export const config = {
  matcher: ["/admin/:path*"]
};
