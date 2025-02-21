import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// List of paths that should not have the admin layout
const NO_ADMIN_LAYOUT_PATHS = ['/admin/login'];

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
    const isLoginPage = req.nextUrl.pathname === "/admin/login";

    // If trying to access login page while authenticated, redirect to admin
    if (isLoginPage && token?.isAdmin) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // If trying to access admin routes but not authenticated or not admin
    if (!isLoginPage && req.nextUrl.pathname.startsWith("/admin")) {
      if (!token || !token.isAdmin) {
        // Create login URL
        const loginUrl = new URL("/admin/login", req.url);
        // Only set callbackUrl if it's not already the login page
        if (!req.nextUrl.pathname.includes("/admin/login")) {
          loginUrl.searchParams.set("callbackUrl", "/admin");
        }
        return NextResponse.redirect(loginUrl);
      }
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
        // Allow access to login page without authentication
        if (req.nextUrl.pathname === "/admin/login") {
          return true;
        }
        // For admin routes, require admin token
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.isAdmin === true;
        }
        return true;
      }
    },
    pages: {
      signIn: "/admin/login",
    }
  }
);

export const config = {
  matcher: ["/admin/:path*"]
};
