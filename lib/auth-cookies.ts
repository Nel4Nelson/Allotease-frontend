// Helper functions to manage auth cookies for server-side access

export function setAuthCookie(token: string, remember: boolean = true): void {
  if (typeof window === 'undefined') return;

  const maxAge = remember ? 30 * 24 * 60 * 60 : undefined; // 30 days or session
  const expires = remember ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined;

  let cookieString = `auth_token=${token}; path=/; secure; samesite=strict`;
  
  if (maxAge) {
    cookieString += `; max-age=${maxAge}`;
  }
  
  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  document.cookie = cookieString;
  console.log('🍪 Auth cookie set for server-side detection');
}

export function clearAuthCookie(): void {
  if (typeof window === 'undefined') return;
  
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';
  console.log('🍪 Auth cookie cleared');
}

// Get auth cookie value (client-side only)
export function getAuthCookie(): string | null {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth_token') {
      return value || null;
    }
  }
  return null;
}