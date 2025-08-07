"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/services/auth-service";
import { ApiError } from "@/services/api-client";
import { SignInForm, SignInFormData } from "./signin-form";
import toast from 'react-hot-toast';

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Capture and store redirect parameter immediately
  useEffect(() => {
    const redirectParam = searchParams.get('redirect');
    if (redirectParam) {
      // Store in sessionStorage so it survives page reloads/state changes
      sessionStorage.setItem('intended_redirect', redirectParam);
    }
  }, [searchParams]);

  const handleSubmit = async (data: SignInFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await AuthService.userLogin(data);

      // Check if signin was successful
      if (response.status === "success") {
        setSuccess(true);
        toast.success('Welcome back! Redirecting...');
        
        // Get the stored redirect parameter
        const storedRedirect = sessionStorage.getItem('intended_redirect');
        
        if (storedRedirect) {
          // Clean up stored redirect
          sessionStorage.removeItem('intended_redirect');
          
          // Small delay to ensure auth state is fully set
          setTimeout(() => {
            try {
              const decodedPath = decodeURIComponent(storedRedirect);
              router.push(decodedPath);
            } catch (redirectError) {
              // Fallback to homepage on error
              console.error('Redirect error:', redirectError);
              toast.error('Redirect failed, going to homepage instead.');
              router.push('/');
            }
          }, 500);
        } else {
          // No redirect parameter, go to homepage
          setTimeout(() => {
            router.push('/');
          }, 500);
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
    return (
      <div className="space-y-4 text-center">
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Welcome Back!
          </h3>
          <p className="text-green-600">
            You have been signed in successfully. Redirecting...
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