"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectUrl?: string;
  className?: string;
}

export function AuthModal({
  isOpen,
  onClose,
  redirectUrl = "",
  className = "",
}: AuthModalProps) {
  if (!isOpen) return null;

  const signinUrl = redirectUrl
    ? `/signin?redirect=${encodeURIComponent(redirectUrl)}`
    : "/signin";

  const signupUrl = redirectUrl
    ? `/signup?redirect=${encodeURIComponent(redirectUrl)}`
    : "/signup";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

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
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors"
          style={{ zIndex: 10 }}
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
          {/* User Icon */}
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="94"
              height="93"
              viewBox="0 0 94 93"
              fill="none"
            >
              <circle cx="47" cy="46.5" r="40" fill="#FF5B06" opacity="0.1" />
              <path
                d="M47 46.5C52.5228 46.5 57 42.0228 57 36.5C57 30.9772 52.5228 26.5 47 26.5C41.4772 26.5 37 30.9772 37 36.5C37 42.0228 41.4772 46.5 47 46.5Z"
                fill="#FF5B06"
              />
              <path
                d="M47 51.5C36.5066 51.5 28 59.5066 28 69.5V71.5C28 73.1569 29.3431 74.5 31 74.5H63C64.6569 74.5 66 73.1569 66 71.5V69.5C66 59.5066 57.4934 51.5 47 51.5Z"
                fill="#FF5B06"
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
            Sign in to Follow Allocation Admins
          </h2>

          {/* Message */}
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
              maxWidth: "400px",
            }}
          >
            Create an account or sign in to follow allocation admins - users who
            create events or own stays
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <Link href={signinUrl}>
              <Button
                onClick={onClose}
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
                Sign In
              </Button>
            </Link>

            <Link href={signupUrl}>
              <Button
                onClick={onClose}
                style={{
                  background: "transparent",
                  borderRadius: "51px",
                  padding: "12px 24px",
                  color: "#FF5B06",
                  fontSize: "16px",
                  fontWeight: 600,
                  fontFamily: "var(--font-source-sans), sans-serif",
                  border: "2px solid #FF5B06",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FF5B06";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#FF5B06";
                }}
              >
                Create Account
              </Button>
            </Link>
          </div>

          {/* Footer Text */}
          <div className="mt-4 text-center">
            <p
              style={{
                color: "#71727A",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: "160%",
              }}
            >
              Follow your favorite allocation admins to stay updated with their
              latest events and stays
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
