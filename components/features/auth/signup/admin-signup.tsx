"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrganizationForm, UserForm } from ".";
import { AuthService } from "@/services/auth-service";
import { OrganizationFormData, UserFormData } from "@/types/auth";
import { ApiError } from "@/services/api-client";

export function AdminSignup() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("1");
  const [userFormData, setUserFormData] = useState<UserFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUserFormSubmit = (data: UserFormData) => {
    setUserFormData(data);
    setCurrentTab("2");
    setError(null);
  };

  const handleOrganizationFormSubmit = async (data: OrganizationFormData) => {
    if (!userFormData) {
      setError(
        "User information is missing. Please go back and fill the form again."
      );
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Combine user and organization data for admin signup
      const adminSignupData = {
        // User data
        firstname: userFormData.firstName,
        lastname: userFormData.lastName,
        email: userFormData.email,
        password: userFormData.password,
        confirmPassword: userFormData.confirmPassword,
        // Organization data
        organizationName: data.organizationName,
        phoneNumber: data.phoneNumber,
        accountInfo: data.accountInfo, // Updated field
      };

      const response = await AuthService.adminSignup(adminSignupData);

      if (response.status === "success") {
        // Store email for OTP verification
        AuthService.setVerificationEmail(userFormData.email);

        // Navigate to email verification page
        router.push("/email-verification");
      } else {
        setError("Admin signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Admin signup error:", error);

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

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <TabsList className="grid w-20 grid-cols-2 bg-[var(--card-background)] border border-[var(--input-border)] tab-trigger">
            <TabsTrigger value="1" disabled={isLoading}>
              1
            </TabsTrigger>
            <TabsTrigger value="2" disabled={!userFormData || isLoading}>
              2
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Step 1: Personal Information */}
        <TabsContent value="1" className="space-y-6">
          <UserForm
            onSubmit={handleUserFormSubmit}
            defaultValues={userFormData}
            submitButtonText="Next"
          />
        </TabsContent>

        {/* Step 2: Organization Details */}
        <TabsContent value="2" className="space-y-6">
          <OrganizationForm
            onSubmit={handleOrganizationFormSubmit}
            isLoading={isLoading}
            submitButtonText="Sign Up"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
