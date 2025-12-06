/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

interface ConfirmStayModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    stayTitle: string;
    isLoading?: boolean;
    className?: string;
}

export function ConfirmStayModal({
    isOpen,
    onClose,
    onConfirm,
    stayTitle,
    isLoading = false,
    className = "",
}: ConfirmStayModalProps) {
    const [mounted, setMounted] = useState(false);

    // Ensure component is mounted before accessing document
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20"
                onClick={onClose}
                style={{ zIndex: 1 }}
            />

            {/* Modal */}
            <div
                className={`relative ${className}`}
                style={{
                    borderRadius: "20px",
                    background: "rgba(242, 244, 247, 0.60)",
                    boxShadow: "0 4px 10px 0 rgba(0, 0, 0, 0.04)",
                    backdropFilter: "blur(83.3499984741211px)",
                    display: "flex",
                    width: "666px",
                    maxWidth: "90vw",
                    padding: "20px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "40px",
                    zIndex: 2,
                }}
            >
                {/* Close Button */}
                <div
                    className="absolute top-4 right-4"
                    style={{ zIndex: 50 }}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!isLoading) {
                            onClose();
                        }
                    }}
                >
                    <button
                        type="button"
                        disabled={isLoading}
                        className="p-3 hover:bg-black/5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            minWidth: "44px",
                            minHeight: "44px",
                            WebkitTapHighlightColor: "transparent",
                            touchAction: "manipulation",
                            background: "transparent",
                            border: "none",
                            cursor: isLoading ? "not-allowed" : "pointer",
                        }}
                    >
                        <svg
                            className="w-5 h-5"
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
                    </button>
                </div>

                {/* Background Gradient Container */}
                <div
                    className="absolute inset-0"
                    style={{
                        opacity: 0.6,
                        background:
                            "linear-gradient(354deg, #FFF 24.04%, rgba(255, 243, 230, 0.35) 59.41%, #D5FFEB 113.97%)",
                        filter: "blur(18.285715103149414px)",
                        borderRadius: "20px",
                    }}
                />

                {/* Content Container */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6 py-8">
                    {/* Warning Icon */}
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="94"
                            height="93"
                            viewBox="0 0 94 93"
                            fill="none"
                        >
                            <circle cx="47" cy="46.5" r="40" fill="#FF9500" opacity="0.1" />
                            <path
                                d="M47 26.5L47 51.5M47 61.5L47 66.5"
                                stroke="#FF9500"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    {/* Title */}
                    <h2
                        style={{
                            color: "var(--Title, #1F2024)",
                            fontFamily: "var(--font-space-grotesk), sans-serif",
                            fontSize: "20px",
                            fontStyle: "normal",
                            fontWeight: 700,
                            lineHeight: "140%",
                            letterSpacing: "-0.4px",
                            margin: 0,
                        }}
                    >
                        Confirm Your Stay
                    </h2>

                    {/* Message */}
                    <div className="space-y-3">
                        <p
                            style={{
                                color: "#1F2024",
                                textAlign: "center",
                                fontFamily: "var(--font-source-sans), sans-serif",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 600,
                                lineHeight: "140%",
                                margin: 0,
                                maxWidth: "500px",
                            }}
                        >
                            {stayTitle}
                        </p>
                        <p
                            style={{
                                color: "#7A7A7A",
                                textAlign: "center",
                                fontFamily: "var(--font-source-sans), sans-serif",
                                fontSize: "14px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "140%",
                                margin: 0,
                                maxWidth: "500px",
                            }}
                        >
                            Please confirm you really get the value of the space you paid for.{" "}
                            <strong style={{ color: "#1F2024" }}>
                                This action is irreversible.
                            </strong>
                        </p>
                        <p
                            style={{
                                color: "#7A7A7A",
                                textAlign: "center",
                                fontFamily: "var(--font-source-sans), sans-serif",
                                fontSize: "13px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "140%",
                                margin: 0,
                                maxWidth: "500px",
                            }}
                        >
                            Once confirmed, you won't be able to request a refund for this
                            booking.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                        <Button
                            onClick={onClose}
                            disabled={isLoading}
                            size="allotease-md"
                            style={{
                                background: "transparent",
                                borderRadius: "51px",
                                padding: "12px 24px",
                                color: "#71727A",
                                fontSize: "16px",
                                fontWeight: 600,
                                fontFamily: "var(--font-source-sans), sans-serif",
                                border: "2px solid #E5E5E5",
                                cursor: isLoading ? "not-allowed" : "pointer",
                                transition: "all 0.2s ease",
                                opacity: isLoading ? 0.5 : 1,
                            }}
                            onMouseEnter={(e) => {
                                if (!isLoading) {
                                    e.currentTarget.style.background = "#F5F5F5";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isLoading) {
                                    e.currentTarget.style.background = "transparent";
                                }
                            }}
                        >
                            Go Back
                        </Button>

                        <Button
                            onClick={onConfirm}
                            disabled={isLoading}
                            type="submit"
                            variant="signup-primary"
                            size="allotease-md"
                            loading={isLoading}
                            style={{
                                background: "#FF5B06",
                                borderRadius: "51px",
                            }}
                            onMouseEnter={(e) => {
                                if (!isLoading) {
                                    e.currentTarget.style.background = "#E54A00";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isLoading) {
                                    e.currentTarget.style.background = "#FF5B06";
                                }
                            }}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Render modal in portal at document.body
    return createPortal(modalContent, document.body);
}