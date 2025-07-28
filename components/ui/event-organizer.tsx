import React from "react";
import Image from "next/image";

interface EventOrganizerProps {
  organizerName: string;
  followerCount: string;
  className?: string;
}

export function EventOrganizer({
  organizerName,
  followerCount,
  className = "",
}: EventOrganizerProps) {
  return (
    <div className={`flex items-center justify-between w-full ${className}`}>
      <div className="flex items-center gap-2">
        <Image
          src="/icons/organizer.svg"
          alt="Organizer"
          width={9}
          height={9}
          className="flex-shrink-0"
        />
        <span
          style={{
            color: "var(--Body, #71727A)",
            fontFamily: "var(--font-source-sans), sans-serif",
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
          }}
        >
          {organizerName}
        </span>
      </div>
      <span
        style={{
          color: "var(--Body, #71727A)",
          fontFamily: "var(--font-source-sans), sans-serif",
          fontSize: "12px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        }}
      >
        {followerCount}
      </span>
    </div>
  );
}
