"use client";
import React, { useState } from "react";
import { AuthLayout } from "../shared";
import { SignupTypeSelector, AttendeeSignup, AdminSignup } from ".";
import { Button } from "@/components/ui/button";
import { UserType } from "@/types/auth";
import { AtIcon } from "@/components/icons";

export function SignUpFlow() {
  const [selectedType, setSelectedType] = useState<UserType | null>(null);

  const handleReset = () => setSelectedType(null);

  const handleGoogleSignup = () => {
    // Handle Google signup logic here
    console.log("Google signup clicked");
  };

  const renderContent = () => {
    if (!selectedType) {
      return <SignupTypeSelector onSelect={setSelectedType} />;
    }

    switch (selectedType) {
      case "attendee":
        return <AttendeeSignup />;
      case "admin":
        return <AdminSignup />;
      default:
        return <SignupTypeSelector onSelect={setSelectedType} />;
    }
  };

  // Show Google button only for attendee signup
  const footerChildren =
    selectedType === "attendee" ? (
      <Button
        variant="allotease-blur"
        size="allotease-md"
        leftIcon={<AtIcon size={24} />}
        onClick={handleGoogleSignup}
        className="w-full"
      >
        Sign up with Google
      </Button>
    ) : undefined;

  const showBackButton = selectedType !== null;

  return (
    <AuthLayout
      title="Register a New Account"
      footerChildren={footerChildren}
      showBackButton={showBackButton}
      onBack={handleReset}
    >
      {renderContent()}
    </AuthLayout>
  );
}
