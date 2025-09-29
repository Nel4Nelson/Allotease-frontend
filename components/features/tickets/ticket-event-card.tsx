"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { EventBadge } from "@/components/ui/event-badge";
import { Divider } from "@/components/ui/divider";

interface TicketEventCardProps {
  title: string;
  dateTime: string;
  imageUrl: string;
  badgeText: string;
  onGetTicket?: () => void;
  disabled?: boolean;
  className?: string;
}

export function TicketEventCard({
  title,
  dateTime,
  imageUrl,
  badgeText,
  onGetTicket,
  disabled = false,
  className = "",
}: TicketEventCardProps) {
  return (
    <div
      className="hidden lg:flex items-stretch gap-3 rounded-3xl cursor-pointer"
      style={{ gap: "12px" }}
    >
      {/* Event Image */}
      <div
        style={{
          display: 'flex',
          height: '176px',
          minWidth: '326px',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'stretch',
          borderRadius: '20px',
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: 'lightgray'
        }}
      />

      {/* Content Section */}
      <div
        className="flex flex-col justify-between flex-1"
        style={{ height: "176px" }}
      >
        {/* Top Content */}
        {/* Event Title */}
        <h3
          className="line-clamp-2"
          style={{
            color: "var(--Title, #1F2024)",
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "140%", // 25.2px
            letterSpacing: "-0.36px",
            margin: 0,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {title}
        </h3>

        {/* Date and Time */}
        <div className="space-y-3">
          <p
            style={{
              color: "var(--Body, #71727A)",
              fontFamily: "var(--font-source-sans), sans-serif",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "142.745%", // 22.839px
              letterSpacing: "-0.32px",
              margin: 0,
            }}
          >
            {dateTime}
          </p>

          <Divider />

          {/* Event Badge */}
          <div
            style={{
              display: 'flex',
              padding: '4px 6px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              width: 'fit-content',
              borderRadius: "54px",
              background: "#F2F4F7",
            }}
          >
            <span
              style={{
                color: 'var(--System-Teal, #1F3A3A)',
                fontFamily: '"Source Sans Pro", sans-serif',
                fontSize: '12px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '14px'
              }}
            >
              {badgeText}
            </span>
          </div>

        </div>

        {/* Bottom Action Button */}
        <Button
          onClick={disabled ? undefined : onGetTicket}
          variant="allotease-blur"
          size="allotease-sm"
          disabled={disabled}
          className="w-full"
          style={{
            borderRadius: "51px",
            background: disabled 
              ? "rgba(242, 244, 247, 0.30)" 
              : "rgba(242, 244, 247, 0.60)",
            backdropFilter: "blur(21px)",
            alignSelf: "stretch",
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          Get another ticket
        </Button>
      </div>
    </div>
  );
}