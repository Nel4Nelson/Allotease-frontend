import { EventBadge } from "@/components/ui/event-badge";
import React from "react";

interface TicketEventCardProps {
  title: string;
  dateTime: string;
  imageUrl: string;
  badgeText: string;
  className?: string;
  onClick?: () => void;
  onGetTicket?: (event?: React.MouseEvent) => void;
}

export function TicketEventCard({
  title,
  dateTime,
  imageUrl,
  badgeText,
  className = "",
  onClick,
  onGetTicket,
}: TicketEventCardProps) {
  return (
    <div
      className={`cursor-pointer transition-transform hover:scale-[1.01] ${className}`}
      style={{
        display: "flex",
        height: "176px",
        minWidth: "300px",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
        alignSelf: "stretch",
      }}
      onClick={onClick}
    >
      {/* Event Image */}
      <div
        style={{
          borderRadius: "24px",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "50%",
          backgroundColor: "lightgray",
          width: "326px",
          alignSelf: "stretch",
        }}
      />

      {/* Event Content */}
      <div className="flex flex-col justify-between h-full flex-1 py-4">
        <div className="space-y-3">
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
              margin: 0,
            }}
          >
            {dateTime}
          </p>

          {/* Badge */}
          <EventBadge>{badgeText}</EventBadge>
        </div>

        {/* Get Ticket Button */}
        <button
          onClick={onGetTicket}
          style={{
            display: "flex",
            width: "287px",
            padding: "6px 12px",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            borderRadius: "51px",
            background: "rgba(242, 244, 247, 0.60)",
            backdropFilter: "blur(21px)",
            border: "none",
            cursor: "pointer",
            color: "var(--Title, #1F2024)",
            fontFamily: "var(--font-source-sans), sans-serif",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "normal",
          }}
        >
          Get another ticket
        </button>
      </div>
    </div>
  );
}
