"use client";
import React, { useState } from "react";
import { AuthService } from "@/services/auth-service";
import { ApiError } from "@/services/api-client";
import { UpgradeForm, UpgradeFormData } from "./upgrade-form";

export function Upgrade() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const getRedirectUrl = (resourceType: string): string => {
    const baseUrl = "/allocation-admin/create";

    switch (resourceType) {
      case "hotel-lodging":
        return `${baseUrl}?type=stays`;
      case "events":
        return `${baseUrl}?type=events`;
      case "all":
      default:
        return baseUrl;
    }
  };

  const handleSubmit = async (data: UpgradeFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Prepare data for API (excluding resourceType as it's for frontend routing only)
      const apiData = {
        organizationName: data.organizationName,
        businessCategory: data.businessCategory,
        businessBio: data.businessBio || "",
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth.toISOString(),
      };

      // Call the partial upgrade endpoint through AuthService
      const response = await AuthService.partialUpgrade(apiData);

      // Check if upgrade was successful
      if (response.status === "success") {
        setSuccess(true);

        // Redirect based on selected resource type
        const redirectUrl = getRedirectUrl(data.resourceType);
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1500);
      } else {
        setError("Account upgrade failed. Please try again.");
      }
    } catch (error) {
      console.error("Upgrade error:", error);

      const apiError = error as ApiError;
      setError(
        apiError.message ||
          "An error occurred during upgrade. Please try again."
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
            Account Upgraded Successfully!
          </h3>
          <p className="text-green-600">
            Your account has been upgraded to allocation admin. Redirecting to
            your dashboard...
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

      {/* Upgrade Form */}
      <UpgradeForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitButtonText="Upgrade account"
      />
    </div>
  );
}
