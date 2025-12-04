"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "../shared";
import { ForgotPassword } from "./forgot-password";


export function ForgotPasswordFlow() {
    const router = useRouter();

    const handleBack = () => {
        router.push("/signin");
    };

    return (
        <AuthLayout
            title="Forgot Password?"
            showBackButton={true}
            onBack={handleBack}
            accountText="Remember your password?"
            linkText="Sign In"
            linkHref="/signin"
            showAccountSection={true}
            footerChildren={undefined}
        >
            <ForgotPassword />
        </AuthLayout>
    );
}