export const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/tickets",
  "/signin",
  "/signup",
  "/upgrade",
  "/email-verification",
];

export const VALID_TYPES = ["events", "stays", "car-parks", "car-park"];

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
  // Check exact public routes
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
  return !isPublicRoute(pathname, searchParams);
}
