"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "../shared";
import { ResetPassword } from "./reset-password";

export function ResetPasswordFlow() {
    const router = useRouter();

    const handleBack = () => {
        router.push("/forgot-password");
    };

    return (
        <AuthLayout
            title="Reset Password"
            showBackButton={true}
            onBack={handleBack}
            accountText="Remember your password?"
            linkText="Sign In"
            linkHref="/signin"
            showAccountSection={true}
            footerChildren={undefined}
        >
            <ResetPassword />
        </AuthLayout>
    );
}