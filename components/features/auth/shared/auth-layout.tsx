import React from "react";
import { AuthFooter, AuthHeader } from ".";

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
  footerChildren?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function AuthLayout({ 
  title, 
  children, 
  footerChildren,
  showBackButton = true,
  onBack
}: AuthLayoutProps) {
  return (
    <div className="auth-background">
      <div className="auth-content">
        <div className="max-w-[20rem] w-full px-4">
          <AuthHeader 
            title={title}
            showBackButton={showBackButton}
            onBack={onBack}
          />
          {children}
          <AuthFooter>{footerChildren}</AuthFooter>
        </div>
      </div>
    </div>
  );
}