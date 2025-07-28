import React from "react";
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
  className = "",
  onClick,
}: StayCardProps) {
  return (
    <div
      className={`flex flex-col cursor-pointer transition-transform hover:scale-[1.02] ${className}`}
      style={{
        display: "flex",
        minWidth: "300px",
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
          borderRadius: "24px",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "50%",
          backgroundColor: "lightgray",
          height: "176px",
          alignSelf: "stretch",
        }}
      />

      <div>
        {/* Title */}
        <h3
          style={{
            color: "var(--Title, #1F2024)",
            fontFamily: '"Space Grotesk"',
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
            fontFamily: '"Source Sans Pro"',
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
