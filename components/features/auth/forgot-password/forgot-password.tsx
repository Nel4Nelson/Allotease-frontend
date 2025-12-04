"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth-service";
import { ApiError } from "@/services/api-client";
import { ForgotPasswordForm, ForgotPasswordFormData } from "./forgot-password-form";
import toast from 'react-hot-toast';

export function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (data: ForgotPasswordFormData) => {
        try {
            setIsLoading(true);
            setError(null);

            console.log(`[ForgotPassword] Sending reset OTP to: ${data.email}`);

            const response = await AuthService.forgotPassword(data.email);

            if (response.status === "success") {
                // Store email in localStorage for reset password page
                localStorage.setItem('reset_email', data.email);

                toast.success(response.message || 'Password reset code sent to your email. It expires in 15 minutes.');

                console.log(`[ForgotPassword] OTP sent successfully, navigating to reset password page`);

                // Navigate to reset password page
                setTimeout(() => {
                    router.push('/reset-password');
                }, 1000);
            } else {
                const errorMessage = response.message || "Failed to send reset code. Please try again.";
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } catch (authError) {
            console.error("Forgot password error:", authError);

            const apiError = authError as ApiError;
            const errorMessage = apiError.message || "Failed to send reset code. Please try again.";

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {/* Forgot Password Form */}
            <ForgotPasswordForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                submitButtonText="Send Reset OTP"
            />
        </div>
    );
}