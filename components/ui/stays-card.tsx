import React from "react";
import Image from "next/image";
import { ReviewBadge } from "./review-badge";
import { StayLocation } from "./stays-card-location";
import { StayDescription } from "./stays-card-description";
import { ReservationButton } from "./reservation-button";
import { Divider } from "./divider";

interface StayCardProps {
  title: string;
  location: string;
  rating: number;
  reviewCount: string;
  description: string;
  imageUrl: string;
  isVerified?: boolean;
  className?: string;
  onClick?: () => void;
}

export function StayCard({
  title,
  location,
  rating,
  reviewCount,
  description,
  imageUrl,
  isVerified = false,
  className = "",
  onClick,
}: StayCardProps) {
  return (
    <div
      className={`flex flex-col cursor-pointer transition-transform hover:scale-[1.02] ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "8px",
        flex: "1 0 0",
      }}
      onClick={onClick}
    >
      {/* Banner Image */}
      <div
        style={{
          position: "relative",
          borderRadius: "24px",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "50%",
          backgroundColor: "lightgray",
          height: "176px",
          alignSelf: "stretch",
        }}
      >
        {/* Verification Badge - Top Right Corner */}
        {isVerified && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "8px",
              padding: "6px 10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Image
              src="/icons/verification.png"
              alt="Verified"
              width={16}
              height={16}
            />
            <span
              style={{
                color: "#1F2024",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              Verified
            </span>
          </div>
        )}
      </div>

      <div>
        {/* Title */}
        <h3
          style={{
            color: "var(--Title, #1F2024)",
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "140%",
            letterSpacing: "-0.36px",
            margin: 0,
          }}
        >
          {title}
        </h3>

        {/* Location */}
        <StayLocation location={location} />
      </div>

      <Divider />

      {/* Review Section */}
      <div className="flex items-center gap-2">
        <ReviewBadge rating={rating} />
        <span
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
          {reviewCount}
        </span>
      </div>

      {/* Description */}
      <div style={{ width: "100%", alignSelf: "stretch" }}>
        <StayDescription description={description} />
      </div>

      {/* Reservation Button */}
      <ReservationButton onClick={onClick} />
    </div>
  );
}