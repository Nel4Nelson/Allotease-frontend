import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { hasAllocatorRole, createRedirectUrl, isAuthenticated } from './lib/auth-utils';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const originalUrl = pathname + (request.nextUrl.search || '');

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname.startsWith('/__nextjs')
  ) {
    return NextResponse.next();
  }

  // Mobile detection for enhanced handling
  const userAgent = request.headers.get('user-agent') || '';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  // Production logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] ${isMobileUA ? 'Mobile' : 'Desktop'} - ${pathname}`);
  }

  // Public route check - optimized for performance
  const isPublic = isPublicRoute(pathname);

  if (isPublic) {
    return NextResponse.next();
  }

  // Check for allocation-admin routes (PROTECTED - for allocators only)
  // Exclude /all-allocation-admins (public route for viewing all admins)
  const isAllocatorRoute = pathname.startsWith('/allocation-admin') && 
                          !pathname.startsWith('/all-allocation-admins');
  
  if (isAllocatorRoute) {
    const authResult = isAuthenticated(request);
    const { isAuth, user, isMobile, shouldBypassMiddleware } = authResult;

    // Mobile bypass for allocator routes
    if (shouldBypassMiddleware && isMobile) {
      const response = NextResponse.next();
      response.headers.set('x-mobile-auth-bypass', 'true');
      return response;
    }

    // Authentication check
    if (!isAuth) {
      const redirectUrl = createRedirectUrl('/signin', originalUrl);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // Role check
    if (!hasAllocatorRole(user)) {
      const upgradeUrl = createRedirectUrl('/upgrade', originalUrl);
      return NextResponse.redirect(new URL(upgradeUrl, request.url));
    }

    return NextResponse.next();
  }

  // For any other route, allow access (permissive mode)
  return NextResponse.next();
}

/**
 * Optimized public route check
 */
function isPublicRoute(pathname: string): boolean {
  // Static public routes - most common first for performance
  if (pathname === '/' || pathname === '/about' || pathname === '/tickets') {
    return true;
  }

  // Auth routes
  if (pathname === '/signin' || pathname === '/signup' || 
      pathname === '/upgrade' || pathname === '/email-verification') {
    return true;
  }

  // Public allocation admin routes (viewing all admins and individual profiles)
  if (pathname === '/all-allocation-admins' || 
      pathname.startsWith('/all-allocation-admins/')) {
    return true;
  }

  // Dynamic routes (single segment) - /[id]
  return /^\/[^\/]+$/.test(pathname);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/ (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api/|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};