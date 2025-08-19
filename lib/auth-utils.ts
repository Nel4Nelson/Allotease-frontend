import { NextRequest } from "next/server";

export interface TokenPayload {
  _id: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

// Helper function to decode JWT token (Edge Runtime compatible)
export function decodeToken(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    if (!base64Url) return null;

    // Edge Runtime compatible base64 decoding
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // Use atob instead of Buffer (Edge Runtime compatible)
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

// Helper function to check if token is completed
export function isTokencompleted(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

// Helper function to get token from request
export function getTokenFromRequest(request: NextRequest): string | null {
  // Try to get from Authorization header first
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Try to get from cookies
  const tokenFromCookie = request.cookies.get("auth_token")?.value;
  if (tokenFromCookie) {
    return tokenFromCookie;
  }

  return null;
}

// Check if the request is from a mobile device
export function isMobileDevice(request: NextRequest): boolean {
  const userAgent = request.headers.get("user-agent") || "";
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
}

// Enhanced mobile-aware auth check
export function isAuthenticated(request: NextRequest): {
  isAuth: boolean;
  user: TokenPayload | null;
  isMobile: boolean;
  shouldBypassMiddleware: boolean;
} {
  const token = getTokenFromRequest(request);
  const isMobile = isMobileDevice(request);

  if (!token) {
    return {
      isAuth: false,
      user: null,
      isMobile,
      shouldBypassMiddleware: false,
    };
  }

  if (isTokencompleted(token)) {
    // On mobile, only suggest bypass if we have auth indicators AND it's a protected route
    const hasAuthIndicators = !!(
      request.cookies.get("auth_token") || request.headers.get("authorization")
    );

    // Only bypass for routes that actually need auth protection
    const needsAuthProtection =
      request.nextUrl.pathname.includes("/allocation-admin/") ||
      request.nextUrl.pathname.includes("/dashboard/") ||
      request.nextUrl.pathname.includes("/profile/") ||
      request.nextUrl.pathname.includes("/settings/");

    return {
      isAuth: false,
      user: null,
      isMobile,
      shouldBypassMiddleware:
        isMobile && hasAuthIndicators && needsAuthProtection,
    };
  }

  const user = decodeToken(token);

  // Additional mobile check - if we can't decode but have token, bypass only for protected routes
  if (!user && isMobile && token) {
    const needsAuthProtection =
      request.nextUrl.pathname.includes("/allocation-admin/") ||
      request.nextUrl.pathname.includes("/dashboard/") ||
      request.nextUrl.pathname.includes("/profile/") ||
      request.nextUrl.pathname.includes("/settings/");

    return {
      isAuth: false,
      user: null,
      isMobile,
      shouldBypassMiddleware: needsAuthProtection,
    };
  }

  return {
    isAuth: !!user,
    user,
    isMobile,
    shouldBypassMiddleware: false,
  };
}

// Helper function to check if user has allocator role
export function hasAllocatorRole(user: TokenPayload | null): boolean {
  return user?.role === "allocator";
}

// Backward compatibility
export function hasAdminRole(user: TokenPayload | null): boolean {
  return hasAllocatorRole(user);
}

// Helper function to create redirect URL with preserved destination
export function createRedirectUrl(
  redirectTo: string,
  originalUrl: string
): string {
  try {
    let redirectUrl = redirectTo;

    // Only preserve destination for non-public routes and non-auth routes
    const shouldPreserve =
      originalUrl !== "/" &&
      !originalUrl.startsWith("/signin") &&
      !originalUrl.startsWith("/signup") &&
      !originalUrl.startsWith("/login") &&
      !originalUrl.startsWith("/about") &&
      !originalUrl.startsWith("/upgrade") &&
      !originalUrl.startsWith("/email-verification");

    if (shouldPreserve) {
      // Simple query parameter append
      const separator = redirectTo.includes("?") ? "&" : "?";
      const encodedOriginalUrl = encodeURIComponent(originalUrl);
      redirectUrl = `${redirectTo}${separator}redirect=${encodedOriginalUrl}`;
    }

    return redirectUrl;
  } catch (error) {
    console.error("Error creating redirect URL:", error);
    return redirectTo; // Fallback to simple redirect
  }
}
