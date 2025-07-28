/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { OtpInput } from "./otp-input";
import { AuthService } from "@/services/auth-service";
import { ApiError } from "@/types/auth";
import { AuthLayout } from "../shared";

export function EmailVerification() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    // Get email from session storage
    const verificationEmail = AuthService.getVerificationEmail();
    if (!verificationEmail) {
      // If no email found, redirect to signup
      router.push("/signup");
      return;
    }
    setEmail(verificationEmail);
  }, [router]);

  useEffect(() => {
    // Cooldown timer for resend button
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpComplete = (otpValue: string) => {
    // Just store the OTP, don't auto-verify
    setOtp(otpValue);
    setError(null); // Clear any previous errors
  };

  const handleVerifyClick = async () => {
    if (!email || !otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    try {
      setIsVerifying(true);
      setError(null);

      const response = await AuthService.verifyOtp({
        email,
        otp: otp,
      });

      if (response.status === "success") {
        setSuccess(true);

        // Clear verification email from session
        AuthService.clearVerificationEmail();

        // Redirect to home page after success
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError("Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);

      const apiError = error as ApiError;
      setError(apiError.message || "Invalid OTP. Please try again.");

      // Reset the OTP input on error by changing the key
      setResetKey((prev) => prev + 1);
      setOtp(""); // Clear stored OTP
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email || isResending || resendCooldown > 0) return;

    try {
      setIsResending(true);
      setError(null);

      const response = await AuthService.resendOtp({ email });

      if (response.status === "success") {
        setResendCooldown(60); // 60 second cooldown
        // Reset OTP input after successful resend
        setResetKey((prev) => prev + 1);
        setOtp(""); // Clear stored OTP
        setError(null);
      }
    } catch (error) {
      console.error("Resend OTP error:", error);

      const apiError = error as ApiError;
      setError(apiError.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = () => {
    router.push("/signup");
  };

  const maskEmail = (email: string) => {
    const [username, domain] = email.split("@");
    const maskedUsername =
      username.length > 2
        ? username.slice(0, 2) + "*".repeat(username.length - 2)
        : username;
    return `${maskedUsername}@${domain}`;
  };

  if (success) {
    return (
      <AuthLayout
        title="Email Verified Successfully!"
        showBackButton={false}
        onBack={undefined}
        footerChildren={undefined}
      >
        <div className="space-y-6 text-center">
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2 font-space-grotesk">
              Account Activated!
            </h3>
            <p className="text-green-600 font-source-sans-pro">
              Your account has been activated. Redirecting you to the home page...
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify Your Email"
      showBackButton={true}
      onBack={handleBack}
      footerChildren={undefined}
    >
      <div className="space-y-6">
        {/* Description */}
        <div className="text-center space-y-3">
          <p className="text-[var(--body-text)] font-source-sans-pro max-w-md mx-auto">
            We've sent a 6-digit verification code to{" "}
            <span className="font-semibold text-[var(--title-color)]">
              {email ? maskEmail(email) : "your email"}
            </span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-source-sans-pro text-center">
              {error}
            </p>
          </div>
        )}

        {/* OTP Input */}
        <div className="space-y-6">
          <OtpInput
            key={resetKey}
            length={6}
            onComplete={handleOtpComplete}
            disabled={isVerifying}
            error={!!error}
          />

          {/* Manual Verification Button */}
          <div className="flex justify-center">
            <Button
              variant="signup-primary"
              size="allotease-lg"
              className="w-2/3"
              onClick={handleVerifyClick}
              disabled={isVerifying || !otp || otp.length !== 6}
              loading={isVerifying}
            >
              Verify Email
            </Button>
          </div>
        </div>

        {/* Resend Section */}
        <div className="text-center space-y-4">
          <p className="text-[var(--body-text)] font-source-sans-pro text-sm">
            Didn't receive the code?
          </p>

          <Button
            variant="ghost"
            size="allotease-md"
            onClick={handleResendOtp}
            disabled={isResending || resendCooldown > 0}
            loading={isResending}
            className="text-[var(--feature-accent-orange)] hover:text-[var(--feature-accent-orange)] hover:bg-[var(--feature-accent-orange)]/10 font-source-sans-pro"
          >
            {resendCooldown > 0 
              ? `Resend in ${resendCooldown}s`
              : "Resend Code"
            }
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}