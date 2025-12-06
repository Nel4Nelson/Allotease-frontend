"use client";
import React, { useState, useEffect } from "react";
import { EventBooking } from "@/services/event-ticket-service";
import { EventService } from "@/services/events-service";

interface ActiveEventTicketCardProps {
  eventId: string;
  title: string;
  imageUrl: string;
  startTime: string;
  endTime: string;
  totalSeats: number;
  totalBookings: number;
  totalPrice: number;
  bookings: EventBooking[];
  status: "active" | "expired";
  onViewEvent?: () => void;
  className?: string;
}

export function ActiveEventTicketCard({
  title,
  imageUrl,
  startTime,
  endTime,
  totalSeats,
  totalBookings,
  totalPrice,
  bookings,
  status,
  onViewEvent,
}: ActiveEventTicketCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [countdown, setCountdown] = useState("");

  // Calculate and update countdown
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();

      if (status === "expired" || now > end) {
        // Event ended
        const diffTime = now - end;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          setCountdown("Event ended today");
        } else if (diffDays === 1) {
          setCountdown("Event ended yesterday");
        } else {
          setCountdown(`Event ended ${diffDays} days ago`);
        }
        return;
      }

      // Event not started yet
      if (now < start) {
        const diffTime = start - now;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(
          (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const diffMinutes = Math.floor(
          (diffTime % (1000 * 60 * 60)) / (1000 * 60)
        );

        if (diffDays > 0) {
          setCountdown(
            `Event starts in ${diffDays} ${diffDays === 1 ? "day" : "days"} ${diffHours} ${diffHours === 1 ? "hour" : "hours"}`
          );
        } else if (diffHours > 0) {
          setCountdown(
            `Event starts in ${diffHours} ${diffHours === 1 ? "hour" : "hours"} ${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"}`
          );
        } else {
          setCountdown(
            `Event starts in ${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"}`
          );
        }
      } else {
        // Event is ongoing
        setCountdown("Event is ongoing");
      }
    };

    calculateCountdown();

    // Update interval based on time remaining
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const relevantTime = now < start ? start : end;
    const diffTime = Math.abs(relevantTime - now);

    const updateInterval = diffTime < 60 * 60 * 1000 ? 1000 : 60000;

    const interval = setInterval(calculateCountdown, updateInterval);

    return () => clearInterval(interval);
  }, [startTime, endTime, status]);

  const formatPrice = (price: number) => {
    return price === 0
      ? "Free"
      : `₦${new Intl.NumberFormat("en-NG").format(price)}`;
  };

  const formatDateTime = (dateTime: string) => {
    return EventService.formatEventDateTime(dateTime);
  };

  // Badge styling based on status
  const getBadgeStyles = () => {
    if (status === "active") {
      return {
        border: "1px solid var(--Uplift-400, #15BA6B)",
        background: "rgba(21, 186, 107, 0.11)",
        color: "#15BA6B",
      };
    }
    return {
      border: "1px solid var(--Body, #71727A)",
      background: "rgba(113, 114, 122, 0.11)",
      color: "#71727A",
    };
  };

  const badgeStyles = getBadgeStyles();
  const badgeText = status === "active" ? "Active" : "Expired";

  return (
    <div className="flex flex-col gap-4 rounded-3xl w-full">
      {/* Main Card */}
      <div className="flex items-stretch gap-4" style={{ minHeight: "200px" }}>
        {/* Event Image */}
        <div
          className="hidden lg:block"
          style={{
            width: "280px",
            minWidth: "280px",
            height: "auto",
            borderRadius: "20px",
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundColor: "lightgray",
          }}
        />

        {/* Content Section */}
        <div className="flex flex-col justify-between flex-1 py-2 gap-3">
          {/* Top Section */}
          <div className="space-y-3">
            {/* Event Title */}
            <h3
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
              {title}
            </h3>

            {/* Date & Time */}
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
              {formatDateTime(startTime)}
            </p>

            {/* Booking Summary */}
            <div
              style={{
                display: "inline-flex",
                padding: "4px 12px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "6px",
                background: "rgba(138, 174, 164, 0.20)",
                width: "fit-content",
              }}
            >
              <span
                style={{
                  color: "#1F3A3A",
                  fontFamily: "var(--font-source-sans), sans-serif",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "142.745%",
                  letterSpacing: "-0.28px",
                }}
              >
                {totalBookings === 1
                  ? `${totalSeats} ${totalSeats === 1 ? "seat" : "seats"} • ${formatPrice(totalPrice)}`
                  : `${totalBookings} bookings (${totalSeats} total seats) • ${formatPrice(totalPrice)}`}
              </span>
            </div>

            {/* Status and Countdown Row */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Status Badge */}
              <div
                style={{
                  display: "inline-flex",
                  padding: "6px 12px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "54px",
                  ...badgeStyles,
                }}
              >
                <span
                  style={{
                    fontFamily: '"Source Sans Pro", sans-serif',
                    fontSize: "13px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "14px",
                  }}
                >
                  {badgeText}
                </span>
              </div>

              {/* Countdown Text */}
              {countdown && (
                <span
                  style={{
                    color: "var(--Body, #71727A)",
                    fontFamily: '"Source Sans Pro", sans-serif',
                    fontSize: "13px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "14px",
                  }}
                >
                  {countdown}
                </span>
              )}
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="flex items-center gap-3">
            {/* View Event Button */}
            <button
              onClick={onViewEvent}
              style={{
                display: "inline-flex",
                padding: "10px 24px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "51px",
                border: "1px solid var(--Uplift-400, #15BA6B)",
                background: "rgba(21, 186, 107, 0.11)",
                backdropFilter: "blur(21px)",
                color: "#15BA6B",
                fontFamily: '"Source Sans Pro", sans-serif',
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "normal",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(21, 186, 107, 0.20)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(21, 186, 107, 0.11)";
              }}
            >
              View Event
            </button>

            {/* Expand/Collapse Button for multiple bookings */}
            {totalBookings > 1 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                  display: "inline-flex",
                  padding: "10px 24px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  borderRadius: "51px",
                  border: "1px solid rgba(138, 174, 164, 0.20)",
                  background: "rgba(242, 244, 247, 0.60)",
                  backdropFilter: "blur(21px)",
                  color: "#1F3A3A",
                  fontFamily: '"Source Sans Pro", sans-serif',
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(242, 244, 247, 0.80)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(242, 244, 247, 0.60)";
                }}
              >
                {isExpanded ? "Hide" : "View"} Bookings
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Bookings List */}
      {isExpanded && totalBookings > 1 && (
        <div
          className="ml-0 lg:ml-[296px] space-y-3 p-4 rounded-2xl"
          style={{
            background: "rgba(242, 244, 247, 0.40)",
            border: "1px solid rgba(138, 174, 164, 0.10)",
          }}
        >
          <h4
            style={{
              color: "var(--Title, #1F2024)",
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "16px",
              fontWeight: 600,
              margin: 0,
              marginBottom: "8px",
            }}
          >
            Your Bookings
          </h4>

          {bookings.map((booking, index) => (
            <div
              key={booking.bookingId}
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(138, 174, 164, 0.10)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "rgba(138, 174, 164, 0.10)",
                    color: "#1F3A3A",
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </div>

                <div>
                  <p
                    style={{
                      color: "var(--Title, #1F2024)",
                      fontFamily: "var(--font-source-sans), sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    {booking.numberOfSeats}{" "}
                    {booking.numberOfSeats === 1 ? "seat" : "seats"} •{" "}
                    {formatPrice(booking.totalPrice)}
                  </p>
                  <p
                    style={{
                      color: "var(--Body, #71727A)",
                      fontFamily: "var(--font-source-sans), sans-serif",
                      fontSize: "12px",
                      margin: 0,
                    }}
                  >
                    Booking ID: {booking.bookingId.slice(-8)}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "inline-flex",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  background:
                    booking.status === "active"
                      ? "rgba(21, 186, 107, 0.11)"
                      : "rgba(113, 114, 122, 0.11)",
                  color:
                    booking.status === "active" ? "#15BA6B" : "#71727A",
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              >
                {booking.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}