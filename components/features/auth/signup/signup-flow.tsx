"use client";
import React from "react";
import { AuthLayout } from "../shared";
import { UserSignup } from ".";
import { Button } from "@/components/ui/button";
import { AtIcon } from "@/components/icons";
import { AuthService } from "@/services/auth-service";

export function SignUpFlow() {
  const handleGoogleSignup = () => {
    console.log("[SignUpFlow] Initiating Google Sign Up");
    AuthService.initiateGoogleSignUp();
  };

  // Always show Google button since everyone signs up as user
  const footerChildren = (
    <Button
      variant="allotease-blur"
      size="allotease-md"
      leftIcon={<AtIcon size={24} />}
      onClick={handleGoogleSignup}
      className="w-full"
    >
      Sign up with Google
    </Button>
  );

  return (
    <AuthLayout
      title="Register a New Account"
      footerChildren={footerChildren}
      showBackButton={false}
      onBack={undefined}
    >
      <UserSignup />
    </AuthLayout>
  );
}