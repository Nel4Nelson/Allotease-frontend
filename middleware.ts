// middleware.ts (root level) - Production version

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isPublicRoute, isAdminRoute, isProtectedRoute } from './lib/route-config';
import { isAuthenticated, hasAllocatorRole, createRedirectUrl } from './lib/auth-utils';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const originalUrl = pathname + (request.nextUrl.search || '');

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') || // Skip files with extensions
    pathname.startsWith('/__nextjs')
  ) {
    return NextResponse.next();
  }

  // Check if route is public
  if (isPublicRoute(pathname, searchParams)) {
    return NextResponse.next();
  }

  // Get authentication status
  const { isAuth, user } = isAuthenticated(request);

  // Check if route requires allocator role (allocation-admin routes)
  if (isAdminRoute(pathname)) {
    if (!isAuth) {
      const redirectUrl = createRedirectUrl('/signin', originalUrl);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    if (!hasAllocatorRole(user)) {
      const upgradeUrl = createRedirectUrl('/upgrade', originalUrl);
      return NextResponse.redirect(new URL(upgradeUrl, request.url));
    }

    return NextResponse.next();
  }

  // Check if route is protected (requires authentication)
  if (isProtectedRoute(pathname, searchParams)) {
    if (!isAuth) {
      const redirectUrl = createRedirectUrl('/signin', originalUrl);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    return NextResponse.next();
  }

  // Default: allow the request
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api/ (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - public folder files
   */
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};