"use client";
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import toast from 'react-hot-toast';

/**
 * Production AuthRedirectHandler with error handled with toast notifications
 */
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

  // Main redirect logic
  useEffect(() => {
    // Wait for hydration AND auth loading to complete
    if (!isHydrated || isLoading) {
      return;
    }

    // Don't redirect if already redirected in this session
    if (hasRedirected.current) {
      return;
    }

    if (isAuthenticated) {
      const currentPath = pathname;
      const redirectPath = searchParams.get('redirect');
      const isAuthPage = currentPath.includes('/signin') || 
                        currentPath.includes('/signup');
                    

      // Scenario 1: User is on auth page and has a redirect destination
      if (isAuthPage && redirectPath) {
        hasRedirected.current = true;
        
        try {
          const decodedPath = decodeURIComponent(redirectPath);
          router.push(decodedPath);
          
          // Clean up URL after redirect
          setTimeout(() => {
            try {
              const currentUrl = new URL(window.location.href);
              currentUrl.searchParams.delete('redirect');
              window.history.replaceState({}, '', currentUrl.toString());
            } catch (cleanupError) {
              // Silently handle cleanup errors - no toast needed for this
              console.warn('URL cleanup failed:', cleanupError);
            }
          }, 500);
        } catch (redirectError) {
          hasRedirected.current = false; // Reset on failure
          toast.error('Redirect failed. Please try navigating manually.');
          console.error('Redirect error:', redirectError);
        }
        return;
      }

      // Scenario 2: User is on auth page but no specific redirect (go to homepage)
      if (isAuthPage && !redirectPath) {
        hasRedirected.current = true;
        
        try {
          router.push('/');
        } catch (homepageError) {
          hasRedirected.current = false;
          toast.error('Navigation failed. Please refresh the page.');
          console.error('Homepage redirect error:', homepageError);
        }
        return;
      }

      // Scenario 3: User is authenticated and not on auth page with redirect param
      if (!isAuthPage && redirectPath) {
        hasRedirected.current = true;
        
        try {
          const decodedPath = decodeURIComponent(redirectPath);
          router.push(decodedPath);
          
          setTimeout(() => {
            try {
              const currentUrl = new URL(window.location.href);
              currentUrl.searchParams.delete('redirect');
              window.history.replaceState({}, '', currentUrl.toString());
            } catch (cleanupError) {
              // Silently handle cleanup errors
              console.warn('URL cleanup failed:', cleanupError);
            }
          }, 500);
        } catch (redirectError) {
          hasRedirected.current = false;
          toast.error('Redirect failed. Please try navigating manually.');
          console.error('Intended destination redirect error:', redirectError);
        }
        return;
      }
    }
  }, [isAuthenticated, isLoading, isHydrated, router, searchParams, pathname, user]);

  // Reset redirect flag when user logs out
  useEffect(() => {
    if (!isAuthenticated && hasRedirected.current) {
      hasRedirected.current = false;
    }
  }, [isAuthenticated]);

  return null;
}