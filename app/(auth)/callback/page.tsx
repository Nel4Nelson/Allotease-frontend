"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { User } from "@/types/auth";
import { setAuthCookie } from "@/lib/auth-cookies";
import toast from "react-hot-toast";
import { AuthLayout } from "@/components/features/auth/shared";
import { SyncLoader } from "react-spinners";

export default function GoogleCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setUserAndToken } = useAuthStore();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const handleGoogleCallback = async () => {
            try {
                // Extract all query parameters
                const token = searchParams.get("token");
                const userId = searchParams.get("userId");
                const email = searchParams.get("email");
                const firstname = searchParams.get("firstname");
                const lastname = searchParams.get("lastname");
                const role = searchParams.get("role");
                const isVerified = searchParams.get("isVerified");

                console.log("[Google Callback] Received params:", {
                    token: token ? "present" : "missing",
                    userId,
                    email,
                    firstname,
                    lastname,
                    role,
                    isVerified,
                });

                // Validate required parameters
                if (!token || !userId || !email) {
                    const errorMessage = "Authentication failed. Missing required information.";
                    console.error("[Google Callback] Missing required params");
                    setError(errorMessage);

                    // Redirect to signin after error
                    setTimeout(() => {
                        router.push("/signin");
                    }, 2000);
                    return;
                }

                // Construct User object from query params
                const user: User = {
                    _id: userId,
                    email: decodeURIComponent(email),
                    firstname: firstname ? decodeURIComponent(firstname) : "",
                    lastname: lastname ? decodeURIComponent(lastname) : "",
                    role: (role as "user" | "allocator") || "user",
                    isVerified: isVerified === "true",
                };

                console.log("[Google Callback] Constructed user object:", user);

                // Store token and user in auth store
                setUserAndToken(user, token, true);

                // Also set cookie explicitly for server-side access
                setAuthCookie(token, true);

                console.log("[Google Callback] Auth state updated successfully");

                // Set success state (toast will be shown by ConditionalLayout's CustomToast)
                setSuccess(true);
                toast.success("Successfully signed in with Google!");

                // Small delay to ensure auth state is propagated
                setTimeout(() => {
                    console.log("[Google Callback] Redirecting to homepage");
                    router.push("/");
                }, 1000);

            } catch (error) {
                console.error("[Google Callback] Error processing callback:", error);
                const errorMessage = "An error occurred during authentication.";
                setError(errorMessage);

                // Redirect to signin after error
                setTimeout(() => {
                    router.push("/signin");
                }, 2000);
            }
        };

        handleGoogleCallback();
    }, [searchParams, setUserAndToken, router]);

    if (error) {
        return (
            <AuthLayout
                title="Authentication Failed"
                showBackButton={false}
                onBack={undefined}
                footerChildren={undefined}
                showAccountSection={false}
            >
                <div className="space-y-6 text-center">
                    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                        <div className="mb-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-red-800 mb-2 font-space-grotesk">
                            Something went wrong
                        </h3>
                        <p className="text-red-600 font-source-sans-pro">{error}</p>
                        <p className="text-red-500 text-sm mt-2 font-source-sans-pro">
                            Redirecting to sign in...
                        </p>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    if (success) {
        return (
            <AuthLayout
                title="Welcome Back!"
                showBackButton={false}
                onBack={undefined}
                footerChildren={undefined}
                showAccountSection={false}
                showLine={false}
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
                            Successfully Signed In!
                        </h3>
                        <p className="text-green-600 font-source-sans-pro">
                            You have been signed in with Google.
                        </p>
                        <p className="text-sm text-green-500 mt-2 font-source-sans-pro">
                            Redirecting to homepage...
                        </p>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Completing Sign In"
            showBackButton={false}
            onBack={undefined}
            footerChildren={undefined}
            showAccountSection={false}
            showLine={false}
        >
            <div className="space-y-6 text-center py-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <SyncLoader
                        color="#FF5B06"
                        loading={true}
                        size={12}
                        margin={3}
                        speedMultiplier={0.8}
                    />
                    <p className="text-[var(--body-text)] font-source-sans-pro">
                        Please wait while we complete your authentication...
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}