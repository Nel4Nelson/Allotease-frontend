"use client";
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';


export function AuthRedirectHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const hasRedirected = useRef(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for hydration to complete
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Handle authenticated users trying to access auth pages
  useEffect(() => {
    // Wait for hydration AND auth loading to complete
    if (!isHydrated || isLoading) {
      return;
    }

    // Don't redirect if already redirected in this session
    if (hasRedirected.current) {
      return;
    }

    const currentPath = pathname;
    const redirectPath = searchParams.get('redirect');
    
    // Only handle auth pages when user is authenticated
    const isAuthPage = currentPath.includes('/signin') || 
                      currentPath.includes('/signup');

    // Development logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Auth Redirect] Checking:`, {
        isAuthenticated,
        currentPath,
        redirectPath,
        isAuthPage,
        userRole: user?.role
      });
    }

    // SCENARIO 1: Authenticated user on auth page with redirect param
    if (isAuthenticated && isAuthPage && redirectPath) {
      hasRedirected.current = true;
      
      try {
        const decodedPath = decodeURIComponent(redirectPath);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Auth Redirect] Redirecting to: ${decodedPath}`);
        }
        
        // Small delay to ensure signin component has finished processing
        setTimeout(() => {
          router.replace(decodedPath);
        }, 100);
        
      } catch (redirectError) {
        hasRedirected.current = false;
        
        if (process.env.NODE_ENV === 'development') {
          console.error('Auth redirect error:', redirectError);
        }
      }
      return;
    }

    // SCENARIO 2: Authenticated user on auth page without redirect (go home)
    if (isAuthenticated && isAuthPage && !redirectPath) {
      hasRedirected.current = true;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth Redirect] Going to homepage');
      }
      
      setTimeout(() => {
        router.replace('/');
      }, 100);
      return;
    }

    // For all other cases - no action needed
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth Redirect] No action needed');
    }
    
  }, [
    isAuthenticated, 
    isLoading, 
    isHydrated, 
    router, 
    searchParams, 
    pathname, 
    user
  ]);

  // Reset redirect flag when user logs out
  useEffect(() => {
    if (!isAuthenticated && hasRedirected.current) {
      hasRedirected.current = false;
    }
  }, [isAuthenticated]);

  return null;
}