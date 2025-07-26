import React from "react";
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
  className = "",
  onClick,
}: EventCardProps) {
  return (
    <div
      className={`flex flex-col cursor-pointer transition-transform hover:scale-[1.02] ${className}`}
      style={{
        display: "flex",
        height: "auto",
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
          flexShrink: 0,
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
            fontFamily: '"Source Sans Pro"',
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
