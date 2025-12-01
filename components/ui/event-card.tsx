import React from "react";
import Image from "next/image";
import { EventBadge } from "./event-badge";
import { EventOrganizer } from "./event-organizer";
import { Divider } from "./divider";

interface EventCardProps {
  title: string;
  dateTime: string;
  imageUrl: string;
  badgeText: string;
  organizerName: string;
  followerCount: string;
  isVerified?: boolean;
  className?: string;
  onClick?: () => void;
}

export function EventCard({
  title,
  dateTime,
  imageUrl,
  badgeText,
  organizerName,
  followerCount,
  isVerified = false,
  className = "",
  onClick,
}: EventCardProps) {
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
          flexShrink: 0,
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
            alignSelf: "stretch",
            margin: 0,
          }}
        >
          {title}
        </h3>

        {/* Date and Time */}
        <p
          style={{
            color: "var(--Body, #71727A)",
            fontFamily: "var(--font-source-sans), sans-serif",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "142.745%",
            letterSpacing: "-0.32px",
            alignSelf: "stretch",
            margin: 0,
          }}
        >
          {dateTime}
        </p>
      </div>

      {/* Badge */}
      <EventBadge>{badgeText}</EventBadge>

      <Divider />

      {/* Organizer Section */}
      <EventOrganizer
        organizerName={organizerName}
        followerCount={followerCount}
      />
    </div>
  );
}