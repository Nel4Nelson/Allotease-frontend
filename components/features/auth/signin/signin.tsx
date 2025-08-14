"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/services/auth-service";
import { useAuthStore } from "@/stores/auth-store";
import { ApiError } from "@/services/api-client";
import { SignInForm, SignInFormData } from "./signin-form";
import toast from 'react-hot-toast';

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isMobileDevice, isAuthenticated } = useAuthStore();

  // Enhanced redirect parameter management
  useEffect(() => {
    const redirectParam = searchParams.get('redirect');
    console.log('[SignIn] Redirect param from URL:', redirectParam);
    
    if (redirectParam) {
      // Store in multiple places for reliability
      sessionStorage.setItem('intended_redirect', redirectParam);
      localStorage.setItem('signin_redirect_backup', redirectParam);
      
      console.log('[SignIn] Stored redirect param:', redirectParam);
    }
  }, [searchParams]);

  // Handle case where user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectParam = searchParams.get('redirect');
      console.log('[SignIn] Already authenticated, redirect param:', redirectParam);
      
      if (redirectParam) {
        setTimeout(() => {
          try {
            const decodedPath = decodeURIComponent(redirectParam);
            console.log('[SignIn] Already auth - redirecting to:', decodedPath);
            router.push(decodedPath);
          } catch (error) {
            console.error('[SignIn] Redirect error:', error);
            router.push('/');
          }
        }, 200);
      } else {
        setTimeout(() => {
          router.push('/');
        }, 200);
      }
    }
  }, [isAuthenticated, searchParams, router]);

  const handleSubmit = async (data: SignInFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(`[SignIn] Starting login process`);

      const response = await AuthService.userLogin(data);

      // Check if signin was successful
      if (response.status === "success") {
        setSuccess(true);
        toast.success('Welcome back! Redirecting...');
        
        // Get stored redirect with multiple fallbacks
        const getStoredRedirect = () => {
          // First try URL param (most reliable)
          const urlRedirect = searchParams.get('redirect');
          if (urlRedirect) {
            console.log('[SignIn] Found redirect in URL:', urlRedirect);
            return urlRedirect;
          }
          
          // Then try sessionStorage
          const sessionRedirect = sessionStorage.getItem('intended_redirect');
          if (sessionRedirect) {
            console.log('[SignIn] Found redirect in sessionStorage:', sessionRedirect);
            return sessionRedirect;
          }
          
          // Finally try localStorage backup
          const localRedirect = localStorage.getItem('signin_redirect_backup');
          if (localRedirect) {
            console.log('[SignIn] Found redirect in localStorage backup:', localRedirect);
            return localRedirect;
          }
          
          console.log('[SignIn] No redirect found');
          return null;
        };

        const storedRedirect = getStoredRedirect();
        
        console.log(`[SignIn] Login successful, processing redirect:`, storedRedirect);
        
        if (storedRedirect) {
          // Clean up stored redirects
          sessionStorage.removeItem('intended_redirect');
          localStorage.removeItem('signin_redirect_backup');
          
          // Enhanced delay to ensure auth state is fully set
          const delay = 800; // Longer delay to ensure auth state propagation
          
          setTimeout(() => {
            try {
              const decodedPath = decodeURIComponent(storedRedirect);
              console.log(`[SignIn] Redirecting to intended destination: ${decodedPath}`);
              
              // Use replace instead of push to avoid back button issues
              router.replace(decodedPath);
            } catch (redirectError) {
              console.error('[SignIn] Redirect decode error:', redirectError);
              toast.error('Redirect failed, going to homepage instead.');
              router.replace('/');
            }
          }, delay);
        } else {
          // No redirect parameter, go to homepage
          setTimeout(() => {
            console.log('[SignIn] No redirect, going to homepage');
            router.replace('/');
          }, 400);
        }

        // Additional verification for mobile
        if (isMobileDevice) {
          setTimeout(() => {
            AuthService.synchronizeMobileAuth();
          }, 1000);
        }
      } else {
        setError("Sign in failed. Please try again.");
        toast.error("Sign in failed. Please try again.");
      }
    } catch (authError) {
      console.error("Sign in error:", authError);

      const apiError = authError as ApiError;
      const errorMessage = apiError.message || "Invalid email or password. Please try again.";
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    const redirectParam = searchParams.get('redirect');
    const destinationText = redirectParam 
      ? `Redirecting to ${decodeURIComponent(redirectParam)}...`
      : 'Redirecting to homepage...';

    return (
      <div className="space-y-4 text-center">
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Welcome Back!
          </h3>
          <p className="text-green-600">
            You have been signed in successfully.
          </p>
          <p className="text-sm text-green-500 mt-2">
            {destinationText}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Sign In Form */}
      <SignInForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitButtonText="Sign In"
      />
    </div>
  );
}