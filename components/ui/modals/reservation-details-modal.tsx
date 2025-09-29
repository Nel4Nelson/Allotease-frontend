"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { EventReservation } from "@/services/event-reservations-service";

interface ReservationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: EventReservation | null;
}

export function ReservationDetailsModal({
  isOpen,
  onClose,
  reservation,
}: ReservationDetailsModalProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !reservation) return null;

  // Format full name
  const fullName = `${reservation.clientId.firstname} ${reservation.clientId.lastname}`;

  // Dummy phone number (will be replaced with real data later)
  const dummyPhone = "+234 709 568 4321";

  // Generate dummy seat numbers
  const dummySeats = Array.from(
    { length: reservation.numberOfSeats },
    (_, i) => `#${17 + i}`
  );

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Modal */}
      <div
        className="relative"
        style={{
          borderRadius: "20px",
          background: "rgba(242, 244, 247, 0.60)",
          boxShadow: "0 4px 10px 0 rgba(0, 0, 0, 0.04)",
          backdropFilter: "blur(83.3499984741211px)",
          display: "flex",
          width: "600px",
          maxWidth: "90vw",
          padding: "32px",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-3 hover:bg-black/5 rounded-full transition-colors z-20"
          style={{
            minWidth: "44px",
            minHeight: "44px",
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          aria-label="Close modal"
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
        <div className="relative z-10 flex flex-col items-start justify-start w-full space-y-6">
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
            className="w-full text-center"
          >
            Reservation Details
          </h2>

          {/* Details Grid */}
          <div className="w-full grid grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <h3
                style={{
                  color: "var(--Title, #1F2024)",
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "140%",
                  letterSpacing: "-0.32px",
                }}
              >
                Full name
              </h3>
              <p
                style={{
                  color: "var(--Body, #71727A)",
                  fontFamily: "var(--font-source-sans), sans-serif",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "142.745%",
                  letterSpacing: "-0.28px",
                }}
              >
                {fullName}
              </p>
            </div>

            {/* Tickets */}
            <div className="space-y-2">
              <h3
                style={{
                  color: "var(--Title, #1F2024)",
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "140%",
                  letterSpacing: "-0.32px",
                }}
              >
                Tickets
              </h3>
              <p
                style={{
                  color: "var(--Body, #71727A)",
                  fontFamily: "var(--font-source-sans), sans-serif",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "142.745%",
                  letterSpacing: "-0.28px",
                }}
              >
                {reservation.numberOfSeats}
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <h3
                style={{
                  color: "var(--Title, #1F2024)",
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "140%",
                  letterSpacing: "-0.32px",
                }}
              >
                Email
              </h3>
              <p
                style={{
                  color: "var(--Body, #71727A)",
                  fontFamily: "var(--font-source-sans), sans-serif",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "142.745%",
                  letterSpacing: "-0.28px",
                }}
              >
                {reservation.clientId.email}
              </p>
            </div>

            {/* Assigned Seats */}
            <div className="space-y-2">
              <h3
                style={{
                  color: "var(--Title, #1F2024)",
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "140%",
                  letterSpacing: "-0.32px",
                }}
              >
                Assigned seats
              </h3>
              <div className="flex items-center gap-1 flex-wrap">
                {dummySeats.map((seat, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-0.5 px-2 py-1 rounded-lg border border-[#0A9355] bg-[#ECFDF3]"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0A9355"
                      strokeWidth="2"
                    >
                      <path d="M4 16v-2a2 2 0 012-2h12a2 2 0 012 2v2" />
                      <rect x="4" y="6" width="16" height="8" rx="1" />
                      <path d="M4 6V4a2 2 0 012-2h12a2 2 0 012 2v2" />
                    </svg>
                    <span className="text-[#0A9355] font-source-sans text-sm font-semibold leading-[14px]">
                      {seat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <h3
                style={{
                  color: "var(--Title, #1F2024)",
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "140%",
                  letterSpacing: "-0.32px",
                }}
              >
                Phone
              </h3>
              <p
                style={{
                  color: "var(--Body, #71727A)",
                  fontFamily: "var(--font-source-sans), sans-serif",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "142.745%",
                  letterSpacing: "-0.28px",
                }}
              >
                {dummyPhone}
              </p>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <h3
                style={{
                  color: "var(--Title, #1F2024)",
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "140%",
                  letterSpacing: "-0.32px",
                }}
              >
                Date
              </h3>
              <p
                style={{
                  color: "var(--Body, #71727A)",
                  fontFamily: "var(--font-source-sans), sans-serif",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "142.745%",
                  letterSpacing: "-0.28px",
                }}
              >
                {formatDate(reservation.startTime)}
              </p>
            </div>
          </div>

          {/* Powered by Allotease */}
          <div className="flex justify-center items-center gap-2 mt-6 w-full">
            <p
              style={{
                color: "#71727A",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: "160%",
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