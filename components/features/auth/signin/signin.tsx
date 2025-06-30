"use client";
import React, { useState } from "react";
import { AuthService } from "@/services/auth-service";
import { ApiError } from "@/services/api-client";
import { SignInForm, SignInFormData } from "./signin-form";

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: SignInFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await AuthService.userLogin(data);

      // Check if signin was successful
      if (response.status === "success") {
        setSuccess(true);

        // Redirect after successful signin
        setTimeout(() => {
          window.location.href = "/"; // or wherever users should go after signin
        }, 1500);
      } else {
        setError("Sign in failed. Please try again.");
      }
    } catch (error) {
      console.error("Sign in error:", error);

      const apiError = error as ApiError;
      setError(
        apiError.message || "Invalid email or password. Please try again."
      );
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
            You have been signed in successfully. Redirecting to your
            homepage...
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
