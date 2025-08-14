export const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/tickets",
  "/signin",
  "/signup",
  "/upgrade",
  "/email-verification",
];

export const VALID_TYPES = ["events", "stays", "car-parks"];

export const PUBLIC_DYNAMIC_PATTERNS = [
  /^\/$/, // Home page (allows query params)
  /^\/[^\/]+$/, // /[id] routes (single segment after root)
];

// Routes that require allocator role (changed from allocation-admin)
export const ADMIN_ROUTE_PATTERN = /allocation-admin/;

// Helper function to check if a route is public
export function isPublicRoute(
  pathname: string,
  searchParams?: URLSearchParams
): boolean {
  // Check exact public routes first
  if (PUBLIC_ROUTES.includes(pathname)) {
    return true;
  }

  // Check if it's home page with type query param
  if (pathname === "/" && searchParams) {
    const type = searchParams.get("type");
    return type ? VALID_TYPES.includes(type) : true;
  }

  // Check dynamic routes like /[id] with type query param
  if (PUBLIC_DYNAMIC_PATTERNS.some((pattern) => pattern.test(pathname))) {
    // If it has searchParams, validate the type parameter
    if (searchParams) {
      const type = searchParams.get("type");
      if (type) {
        return VALID_TYPES.includes(type);
      }
    }
    // Allow /[id] routes even without type param
    return true;
  }

  // Additional public patterns for static content and common pages
  const additionalPublicPatterns = [
    /^\/event\/[^\/]+$/, // Event detail pages
    /^\/venue\/[^\/]+$/, // Venue detail pages
    /^\/privacy/, // Privacy policy
    /^\/terms/, // Terms of service
    /^\/contact/, // Contact page
    /^\/help/, // Help pages
    /^\/faq/, // FAQ pages
  ];

  if (additionalPublicPatterns.some((pattern) => pattern.test(pathname))) {
    return true;
  }

  return false;
}

// Helper function to check if route requires allocator role
export function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTE_PATTERN.test(pathname);
}

// Helper function to check if route is protected (requires authentication)
export function isProtectedRoute(
  pathname: string,
  searchParams?: URLSearchParams
): boolean {
  // Public routes are NOT protected
  if (isPublicRoute(pathname, searchParams)) {
    return false;
  }

  // Admin routes are protected but handled separately
  if (isAdminRoute(pathname)) {
    return false; // Let isAdminRoute handle this
  }

  // Define explicitly protected route patterns
  const protectedPatterns = [
    /^\/dashboard/, // Dashboard routes
    /^\/profile/, // Profile routes
    /^\/settings/, // Settings routes
    /^\/reservations/, // Reservation routes
    /^\/bookings/, // Booking routes
    /^\/account/, // Account routes
  ];

  // Check if route matches protected patterns
  const isExplicitlyProtected = protectedPatterns.some(pattern => 
    pattern.test(pathname)
  );

  // For mobile compatibility: be more conservative about what's protected
  // Only routes that explicitly need authentication should be protected
  return isExplicitlyProtected;
}

// Mobile-specific configuration
export const MOBILE_CONFIG = {
  // Routes that might need mobile bypass
  BYPASS_CANDIDATES: [
    '/allocation-admin/',
    '/dashboard/',
    '/profile/',
    '/settings/',
  ],
  
  // Default delays for mobile (in milliseconds)
  DELAYS: {
    AUTH_CHECK: 200,
    REDIRECT: 300,
    COOKIE_SYNC: 100,
    STORE_SYNC: 150,
  },
} as const;

// Check if a route might need mobile bypass
export function isMobileBypassCandidate(pathname: string): boolean {
  // Only admin and explicitly protected routes should be bypass candidates
  return MOBILE_CONFIG.BYPASS_CANDIDATES.some(prefix => 
    pathname.startsWith(prefix)
  ) || isAdminRoute(pathname);
}

// Get mobile delay for specific operations
export function getMobileDelay(delayType: keyof typeof MOBILE_CONFIG.DELAYS): number {
  return MOBILE_CONFIG.DELAYS[delayType];
}

// Enhanced public route check for middleware
export function isDefinitelyPublicRoute(pathname: string, searchParams?: URLSearchParams): boolean {
  // First check standard public routes
  if (isPublicRoute(pathname, searchParams)) {
    return true;
  }

  // Additional patterns that should NEVER require auth
  const alwaysPublicPatterns = [
    /^\/$/,              // Home page
    /^\/about/,          // About pages
    /^\/contact/,        // Contact pages
    /^\/help/,           // Help pages
    /^\/privacy/,        // Privacy pages
    /^\/terms/,          // Terms pages
    /^\/faq/,            // FAQ pages
    /^\/[^\/]+$/ 
  ];

  return alwaysPublicPatterns.some(pattern => pattern.test(pathname));
}