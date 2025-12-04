/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth-service";
import { ApiError } from "@/services/api-client";
import { ResetPasswordForm, ResetPasswordFormData } from "./reset-password-form";
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';

export function ResetPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string>("");
    const [resendCooldown, setResendCooldown] = useState(0);
    const router = useRouter();

    useEffect(() => {
        // Get email from localStorage
        const resetEmail = localStorage.getItem('reset_email');
        if (!resetEmail) {
            // If no email found, redirect to forgot password
            toast.error('Please request a password reset first.');
            router.push("/forgot-password");
            return;
        }
        setEmail(resetEmail);
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

    const handleSubmit = async (data: ResetPasswordFormData) => {
        if (!email) {
            toast.error('Email not found. Please try again.');
            router.push("/forgot-password");
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            console.log(`[ResetPassword] Resetting password for: ${email}`);

            const response = await AuthService.resetPassword(email, data.otp, data.password);

            if (response.status === "success") {
                // Clear email from localStorage
                localStorage.removeItem('reset_email');

                toast.success(response.message || 'Password reset successful! Redirecting to sign in...');

                console.log(`[ResetPassword] Password reset successful, navigating to sign in`);

                // Navigate to sign in page
                setTimeout(() => {
                    router.push('/signin');
                }, 2000);
            } else {
                const errorMessage = response.message || "Failed to reset password. Please try again.";
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } catch (authError) {
            console.error("Reset password error:", authError);

            const apiError = authError as ApiError;
            const errorMessage = apiError.message || "Invalid code or failed to reset password. Please try again.";

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!email || isResending || resendCooldown > 0) return;

        try {
            setIsResending(true);
            setError(null);

            console.log(`[ResetPassword] Resending OTP to: ${email}`);

            const response = await AuthService.forgotPassword(email);

            if (response.status === "success") {
                setResendCooldown(60); // 60 second cooldown
                setError(null);
                toast.success('Verification code sent! Check your email.');
            } else {
                const errorMessage = response.message || "Failed to resend code. Please try again.";
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error("Resend OTP error:", error);

            const apiError = error as ApiError;
            const errorMessage = apiError.message || "Failed to resend OTP. Please try again.";

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsResending(false);
        }
    };

    const maskEmail = (email: string) => {
        const [username, domain] = email.split("@");
        const maskedUsername =
            username.length > 2
                ? username.slice(0, 2) + "*".repeat(username.length - 2)
                : username;
        return `${maskedUsername}@${domain}`;
    };

    return (
        <div className="space-y-6">
            {/* Email Display */}
            {email && (
                <div className="text-center">
                    <p className="text-[var(--body-text)] font-source-sans-pro text-sm">
                        Code sent to{" "}
                        <span className="font-semibold text-[var(--title-color)]">
                            {maskEmail(email)}
                        </span>
                    </p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {/* Reset Password Form */}
            <ResetPasswordForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                submitButtonText="Reset Password"
            />

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
    );
}