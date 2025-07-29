import React from "react";
import { AuthFooter, AuthHeader } from ".";

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
  footerChildren?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  // Add AuthFooter customization props
  accountText?: string;
  linkText?: string;
  linkHref?: string;
  showAccountSection?: boolean;
}

export function AuthLayout({ 
  title, 
  children, 
  footerChildren,
  showBackButton = true,
  onBack,
  // AuthFooter props with defaults
  accountText = "Already have an account?",
  linkText = "Sign In",
  linkHref = "/signin",
  showAccountSection = true,
}: AuthLayoutProps) {
  return (
    <div className="auth-background py-10">
      <div className="auth-content">
        <div className="max-w-[20rem] w-full px-4">
          <AuthHeader 
            title={title}
            showBackButton={showBackButton}
            onBack={onBack}
          />
          {children}
          <AuthFooter
            accountText={accountText}
            linkText={linkText}
            linkHref={linkHref}
            showAccountSection={showAccountSection}
          >
            {footerChildren}
          </AuthFooter>
        </div>
      </div>
    </div>
  );
}