"use client";
import { EmailVerification } from "@/components/features/auth/";

export default function EmailVerificationPage() {
  return (
    <div className="auth-background">
      <div className="auth-content">
        <div className="max-w-[28rem] w-full px-4">
          <EmailVerification />
        </div>
      </div>
    </div>
  );
}
