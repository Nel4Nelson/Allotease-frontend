"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

type BookingType = "stays" | "events";

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: BookingType;
  showToast?: boolean;
  className?: string;
}

interface BookingConfig {
  title: string;
  message: string;
  buttonText: string;
  ticketUrl: string;
  toastMessage: string;
}

const bookingConfigs: Record<BookingType, BookingConfig> = {
  stays: {
    title: "Stay Booked!",
    message: "You have successfully booked your stay",
    buttonText: "View Your Ticket",
    ticketUrl: "/tickets?type=stays",
    toastMessage: "Stay booking completed successfully!",
  },
  events: {
    title: "Event Registered!",
    message: "You have successfully registered for the event",
    buttonText: "View Your Ticket",
    ticketUrl: "/tickets?events",
    toastMessage: "Event registration completed successfully!",
  },
};

export function BookingSuccessModal({
  isOpen,
  onClose,
  type,
  showToast = false,
  className = "",
}: BookingSuccessModalProps) {
  const config = bookingConfigs[type];

  // Show toast only once when modal opens and showToast is true
  useEffect(() => {
    if (isOpen && showToast) {
      // Use a small timeout to ensure the toast appears after modal animation
      const timer = setTimeout(() => {
        toast.success(config.toastMessage);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen, showToast, config.toastMessage]);

  if (!isOpen) return null;

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
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6">
          {/* Success Icon */}
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="94"
              height="93"
              viewBox="0 0 94 93"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M48.8113 59.0825L47.9815 60.553H44.7394L43.763 59.2562C43.7051 59.1674 37.9658 50.5913 30.5476 45.898L28.0968 44.3542L31.1922 39.4602L33.6353 41.004C38.9809 44.3812 43.4194 49.3138 46.0363 52.6061C50.1468 46.4114 59.7727 33.5087 74.5357 23.0452C67.6386 14.3148 56.9822 8.68359 45.0212 8.68359C24.2719 8.68359 7.3899 25.5656 7.3899 46.3149C7.3899 67.0642 24.2719 83.9462 45.0212 83.9462C65.7705 83.9462 82.6525 67.0642 82.6525 46.3149C82.6525 39.6107 80.8693 33.3273 77.7855 27.8698C59.132 41.17 48.9233 58.8857 48.8113 59.0825Z"
                fill="#13C962"
              />
            </svg>
          </div>

          {/* Success Title */}
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
            {config.title}
          </h2>

          {/* Success Message */}
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
            }}
          >
            {config.message}
          </p>

          {/* Action Button */}
          <Link href={config.ticketUrl} className="block">
            <Button
              onClick={onClose}
              className="mt-4"
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
            >
              {config.buttonText}
            </Button>
          </Link>

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
              By selecting Register, I agree to the{" "}
              <span
                style={{
                  color: "#939393",
                  textDecorationLine: "underline",
                }}
              >
                Allotease Terms of Service
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
