// lib/auth-utils.ts - Production version

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

// Helper function to check if token is expired
export function isTokenExpired(token: string): boolean {
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

// Helper function to check if user is authenticated
export function isAuthenticated(request: NextRequest): {
  isAuth: boolean;
  user: TokenPayload | null;
} {
  const token = getTokenFromRequest(request);

  if (!token) {
    return { isAuth: false, user: null };
  }

  if (isTokenExpired(token)) {
    return { isAuth: false, user: null };
  }

  const user = decodeToken(token);
  return { isAuth: !!user, user };
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
    const shouldPreserve = originalUrl !== "/" && 
                          !originalUrl.startsWith("/signin") && 
                          !originalUrl.startsWith("/signup") &&
                          !originalUrl.startsWith("/login") &&
                          !originalUrl.startsWith("/about") &&
                          !originalUrl.startsWith("/upgrade") &&
                          !originalUrl.startsWith("/email-verification");
    
    if (shouldPreserve) {
      // Simple query parameter append
      const separator = redirectTo.includes('?') ? '&' : '?';
      const encodedOriginalUrl = encodeURIComponent(originalUrl);
      redirectUrl = `${redirectTo}${separator}redirect=${encodedOriginalUrl}`;
    }
    
    return redirectUrl;
  } catch (error) {
    console.error("Error creating redirect URL:", error);
    return redirectTo; // Fallback to simple redirect
  }
}