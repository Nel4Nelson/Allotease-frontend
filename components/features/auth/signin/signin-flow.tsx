"use client";
import React from "react";
import { AuthLayout } from "../shared";
import { Button } from "@/components/ui/button";
import { AtIcon } from "@/components/icons";
import { SignIn } from ".";
import { AuthService } from "@/services/auth-service";

export function SignInFlow() {
  const handleGoogleSignin = () => {
    console.log("[SignInFlow] Initiating Google Sign In");
    AuthService.initiateGoogleSignIn();
  };

  // Always show Google button since everyone signs in as user
  const footerChildren = (
    <Button
      variant="allotease-blur"
      size="allotease-md"
      leftIcon={<AtIcon size={18} />}
      onClick={handleGoogleSignin}
      className="w-full"
    >
      Sign in with Google
    </Button>
  );

  return (
    <AuthLayout
      title="Sign In"
      footerChildren={footerChildren}
      showBackButton={false}
      onBack={undefined}
      accountText="Don't have an account?"
      linkText="Sign Up"
      linkHref="/signup"
    >
      <SignIn />
    </AuthLayout>
  );
}