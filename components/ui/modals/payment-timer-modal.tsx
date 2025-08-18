"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface PaymentTimerModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onProceed: () => void;
  timeoutInSeconds: number;
  onTimeExpired: () => void;
  className?: string;
}

export function PaymentTimerModal({
  isOpen,
  onCancel,
  onProceed,
  timeoutInSeconds,
  onTimeExpired,
  className = "",
}: PaymentTimerModalProps) {
  const [timeLeft, setTimeLeft] = useState<number>(timeoutInSeconds);

  // Timer countdown effect
  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, timeLeft, onTimeExpired]);

  // Reset timer when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(timeoutInSeconds);
    }
  }, [isOpen, timeoutInSeconds]);

  // Format timer display (MM:SS)
  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onCancel}
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
          width: "500px",
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
            onCancel();
          }}
        >
          <button
            type="button"
            className="p-3 hover:bg-black/5 rounded-full transition-colors"
            style={{
              minWidth: "44px",
              minHeight: "44px",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
              background: "transparent",
              border: "none",
              cursor: "pointer",
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
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6 py-8 px-4">
          {/* Timer Icon */}
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Timer Display */}
          <div className="text-center">
            <div
              className="text-4xl font-bold mb-2"
              style={{
                color: "#FF5B06",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "48px",
                fontWeight: 700,
                lineHeight: "1",
                letterSpacing: "-0.5px",
              }}
            >
              {formatTimer(timeLeft)}
            </div>
            <p
              style={{
                color: "#71727A",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "140%",
                margin: 0,
              }}
            >
              Time remaining to complete payment
            </p>
          </div>

          {/* Warning Message */}
          <div className="text-center max-w-sm">
            <h3
              style={{
                color: "var(--Title, #1F2024)",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: "140%",
                letterSpacing: "-0.4px",
                margin: "0 0 8px 0",
              }}
            >
              Complete Your Payment
            </h3>
            <p
              style={{
                color: "#7A7A7A",
                textAlign: "center",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "140%",
                margin: 0,
              }}
            >
              You have 10 minutes to complete your payment. Click proceed to
              continue with Paystack.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 w-full max-w-sm">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1"
              style={{
                borderRadius: "51px",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: 600,
                fontFamily: "var(--font-source-sans), sans-serif",
                border: "1px solid #E5E5E5",
                background: "white",
                color: "#6B7280",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={onProceed}
              className="flex-1"
              style={{
                background: "#FF5B06",
                borderRadius: "51px",
                padding: "12px 24px",
                color: "white",
                fontSize: "16px",
                fontWeight: 600,
                fontFamily: "var(--font-source-sans), sans-serif",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#E54A00")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#FF5B06")
              }
            >
              Proceed
            </Button>
          </div>

          {/* Powered by Allotease section */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <p
              style={{
                color: "var(--auth-footer-text, #71727A)",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: "160%",
                margin: 0,
              }}
            >
              Powered by
            </p>
            <Link href="/" className="flex items-center group">
              <Image
                src="/images/brand-logo/logo-black.svg"
                alt="Allotease Logo"
                height={32}
                width={50}
                priority
                className="transition-transform group-hover:scale-105 w-auto"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
