"use client";
import React, { useState } from "react";
import { AuthHeader, AuthFooter } from "../shared";
import { Button } from "@/components/ui/button";
import { AtIcon } from "@/components/icons";
import { RoleSelector } from "../shared/role-selector";
import { SignInForm } from "./signin-form";
import { AuthService } from "@/services/auth-service";
import { UserType, SignInFormData } from "@/types/auth";
import { ApiError } from "@/services/api-client";

export function SignInFlow() {
  const [selectedRole, setSelectedRole] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRoleSelect = (role: UserType) => {
    setSelectedRole(role);
    setError(null);
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
    setError(null);
  };

  const handleSignInSubmit = async (data: SignInFormData) => {
    if (!selectedRole) return;

    try {
      setIsLoading(true);
      setError(null);

      let response;
      if (selectedRole === "attendee") {
        response = await AuthService.userLogin(data);
      } else {
        response = await AuthService.organizationLogin(data);
      }

      if (response.status === "success") {
        setSuccess(true);

        // Redirect after successful signin
        setTimeout(() => {
          window.location.href = "/dashboard";
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

  const handleGoogleSignin = () => {
    // Handle Google signin logic here
    console.log("Google signin clicked");
  };

  // Show success state
  if (success) {
    return (
      <div className="auth-background">
        <div className="auth-content">
          <div className="max-w-[20rem] w-full px-4">
            <div className="space-y-4 text-center">
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Welcome Back!
                </h3>
                <p className="text-green-600">
                  You have been signed in successfully. Redirecting to your
                  dashboard...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Custom footer with Google signin option (only for attendees)
  const customFooter = (
    <AuthFooter
      accountText="Don't have an account?"
      linkText="Sign Up"
      linkHref="/signup"
    >
      {selectedRole === "attendee" && (
        <Button
          variant="allotease-blur"
          size="allotease-md"
          leftIcon={<AtIcon size={18} />}
          onClick={handleGoogleSignin}
          className="w-full"
        >
          Sign in with Google
        </Button>
      )}
    </AuthFooter>
  );

  return (
    <div className="auth-background">
      <div className="auth-content">
        <div className="max-w-[20rem] w-full px-4">
          <AuthHeader
            title="Sign In"
            showBackButton={selectedRole !== null}
            onBack={selectedRole ? handleBackToRoleSelection : undefined}
          />

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Content */}
          {!selectedRole ? (
            <RoleSelector
              onSelect={handleRoleSelect}
              title="How would you like to sign in?"
              subtitle="Choose your account type to continue"
            />
          ) : (
            <SignInForm
              onSubmit={handleSignInSubmit}
              isLoading={isLoading}
              submitButtonText={`Sign in as ${
                selectedRole === "attendee" ? "Attendee" : "Admin"
              }`}
            />
          )}

          {customFooter}
        </div>
      </div>
    </div>
  );
}
