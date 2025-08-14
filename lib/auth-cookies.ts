// Helper functions to manage auth cookies for server-side access

const AUTH_COOKIE_NAME = 'auth_token';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

/**
 * Set authentication cookie with enhanced mobile support
 */
export function setAuthCookie(token: string, remember: boolean = true): void {
  if (typeof window === 'undefined') return;

  const maxAge = remember ? COOKIE_MAX_AGE : undefined;
  const expires = remember ? new Date(Date.now() + COOKIE_MAX_AGE * 1000) : undefined;

  // Build cookie string with mobile-compatible settings
  let cookieString = `${AUTH_COOKIE_NAME}=${token}; path=/; samesite=lax`;
  
  // Use secure flag in production
  if (process.env.NODE_ENV === 'production') {
    cookieString += '; secure';
  }
  
  if (maxAge) {
    cookieString += `; max-age=${maxAge}`;
  }
  
  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  // Set the cookie
  document.cookie = cookieString;
  
  // Also store in localStorage/sessionStorage for immediate mobile access
  try {
    if (remember) {
      localStorage.setItem(AUTH_COOKIE_NAME, token);
      sessionStorage.removeItem(AUTH_COOKIE_NAME);
    } else {
      sessionStorage.setItem(AUTH_COOKIE_NAME, token);
      localStorage.removeItem(AUTH_COOKIE_NAME);
    }
  } catch (error) {
    // Storage might be disabled, continue without it
    if (process.env.NODE_ENV === 'development') {
      console.warn('Storage access failed:', error);
    }
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🍪 Auth cookie set');
  }
}

/**
 * Clear authentication cookie
 */
export function clearAuthCookie(): void {
  if (typeof window === 'undefined') return;
  
  // Clear cookie with both secure and non-secure versions for compatibility
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax`;
  
  if (process.env.NODE_ENV === 'production') {
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=lax`;
  }
  
  // Clear storage
  try {
    localStorage.removeItem(AUTH_COOKIE_NAME);
    sessionStorage.removeItem(AUTH_COOKIE_NAME);
  } catch (error) {
    // Storage might be disabled, continue without it
    if (process.env.NODE_ENV === 'development') {
      console.warn('Storage cleanup failed:', error);
    }
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🍪 Auth cookie cleared');
  }
}

/**
 * Get authentication cookie value (client-side) with mobile fallback
 */
export function getAuthCookie(): string | null {
  if (typeof window === 'undefined') return null;
  
  // First try to get from cookie
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === AUTH_COOKIE_NAME) {
      return value || null;
    }
  }
  
  // Mobile fallback: try storage if cookie not found
  try {
    return localStorage.getItem(AUTH_COOKIE_NAME) || sessionStorage.getItem(AUTH_COOKIE_NAME);
  } catch (error) {
    // Storage might be disabled
    if (process.env.NODE_ENV === 'development') {
      console.warn('Storage access failed during cookie fallback:', error);
    }
    return null;
  }
}

/**
 * Get authentication cookie (server-side) for API routes
 */
export function getServerAuthCookie(): string | null {
  try {
    // Client-side guard
    if (typeof window !== 'undefined') return null;
    
    // Dynamic import for server-side only
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { cookies } = require('next/headers');
    const cookieStore = cookies();
    return cookieStore.get(AUTH_COOKIE_NAME)?.value || null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to read server cookies:', error);
    }
    return null;
  }
}