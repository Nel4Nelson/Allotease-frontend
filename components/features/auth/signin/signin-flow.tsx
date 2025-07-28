"use client";
import React from "react";
import { AuthLayout } from "../shared";
import { Button } from "@/components/ui/button";
import { AtIcon } from "@/components/icons";
import { SignIn } from ".";

export function SignInFlow() {
  const handleGoogleSignin = () => {
    // Handle Google signin logic here
    console.log("Google signin clicked");
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
    >
      <SignIn />
    </AuthLayout>
  );
}
