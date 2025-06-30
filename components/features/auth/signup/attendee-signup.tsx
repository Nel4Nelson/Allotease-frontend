"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserForm } from ".";
import { AuthService } from "@/services/auth-service";
import { UserFormData } from "@/types/auth";
import { ApiError } from "@/services/api-client";

export function AttendeeSignup() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: UserFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Map UserFormData to API format
      const signupData = {
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };

      const response = await AuthService.signup(signupData);

      if (response.status === "success") {
        // Store email for OTP verification
        AuthService.setVerificationEmail(data.email);

        // Navigate to email verification page
        router.push("/email-verification");
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Attendee signup error:", error);

      const apiError = error as ApiError;
      setError(apiError.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Registration Form */}
      <UserForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitButtonText="Sign up"
      />
    </div>
  );
}
