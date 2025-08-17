"use client";
import React, { useState } from "react";
import { useEventFormStore } from "@/stores/event-form-store";

interface EventPreviewRegistrationCardProps {
  className?: string;
}

// Plus Icon Component
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M16.418 10H3.58463"
      stroke="#1F2024"
      strokeWidth="0.777778"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 16.416V3.58268"
      stroke="#1F2024"
      strokeWidth="0.777778"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Minus Icon Component
const MinusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M16.418 10H3.58463"
      stroke="#1F2024"
      strokeWidth="0.777778"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function EventPreviewRegistrationCard({
  className = "",
}: EventPreviewRegistrationCardProps) {
  const { formData } = useEventFormStore();
  const [numberOfTickets, setNumberOfTickets] = useState(1);

  // Get event data from store
  const eventDate = formData.eventDate;
  const eventPrice = formData.price || 0;
  const eventCapacity = formData.capacity || 100;
  const isFree = formData.isFree ?? true;

  // Format end date for ticket sales
  const formatTicketSalesEndDate = (date: Date | undefined) => {
    if (!date) return "Ticket sales ends on event date";
    
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return `Ticket sales ends ${date.toLocaleDateString("en-US", options)}`;
  };

  // Format price
  const formatPrice = (price: number) => {
    if (price === 0 || isFree) return "Free";
    return `₦${price.toLocaleString()}`;
  };

  // Handle quantity change
  const handleDecrement = () => {
    if (numberOfTickets > 1) {
      setNumberOfTickets(numberOfTickets - 1);
    }
  };

  const handleIncrement = () => {
    if (numberOfTickets < eventCapacity) {
      setNumberOfTickets(numberOfTickets + 1);
    }
  };

  return (
    <div
      className={`sticky top-8 ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        border: "1px solid rgba(138, 174, 164, 0.20)",
        background: "rgba(242, 244, 247, 0.30)",
        backdropFilter: "blur(21px)",
        overflow: "hidden",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          background: "rgba(242, 244, 247, 0.80)",
          backdropFilter: "blur(21px)",
          display: "flex",
          padding: "20px 0",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <h3
          style={{
            color: "#1F2024",
            textAlign: "center",
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "20px",
            fontWeight: 700,
            lineHeight: "28px",
            letterSpacing: "-0.4px",
            margin: 0,
          }}
        >
          Register
        </h3>
        <p
          style={{
            color: "#71727A",
            textAlign: "center",
            fontFamily: "var(--font-source-sans), sans-serif",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "17.13px",
            letterSpacing: "-0.24px",
            margin: 0,
          }}
        >
          {formatTicketSalesEndDate(eventDate)}
        </p>
      </div>

      {/* Content Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "32px 24px 20px 24px",
          gap: "16px",
        }}
      >
        {/* Entry Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "#20232A",
              fontFamily: "var(--font-source-sans), sans-serif",
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "16px",
              margin: 0,
            }}
          >
            Entry
          </span>

          {/* Quantity Controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <button
              onClick={handleDecrement}
              disabled={numberOfTickets <= 1}
              style={{
                borderRadius: "50%",
                border: "0.778px solid rgba(138, 174, 164, 0.50)",
                display: "flex",
                width: "28px",
                height: "28px",
                justifyContent: "center",
                alignItems: "center",
                background: "transparent",
                cursor: numberOfTickets <= 1 ? "not-allowed" : "pointer",
                opacity: numberOfTickets <= 1 ? 0.5 : 1,
                padding: 0,
              }}
            >
              <MinusIcon />
            </button>

            <span
              style={{
                color: "#20232A",
                textAlign: "center",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "16px",
                minWidth: "20px",
              }}
            >
              {numberOfTickets}
            </span>

            <button
              onClick={handleIncrement}
              disabled={numberOfTickets >= eventCapacity}
              style={{
                borderRadius: "50%",
                border: "0.778px solid rgba(138, 174, 164, 0.50)",
                display: "flex",
                width: "28px",
                height: "28px",
                justifyContent: "center",
                alignItems: "center",
                background: "transparent",
                cursor: numberOfTickets >= eventCapacity ? "not-allowed" : "pointer",
                opacity: numberOfTickets >= eventCapacity ? 0.5 : 1,
                padding: 0,
              }}
            >
              <PlusIcon />
            </button>
          </div>
        </div>

        {/* Fee Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "#20232A",
              fontFamily: "var(--font-source-sans), sans-serif",
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "16px",
              margin: 0,
            }}
          >
            Fee:
          </span>
          <span
            style={{
              color: "#71727A",
              fontFamily: "var(--font-source-sans), sans-serif",
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "16px",
              margin: 0,
            }}
          >
            {formatPrice(eventPrice * numberOfTickets)}
          </span>
        </div>

        {/* Reserve Button - Disabled for Preview */}
        <button
          disabled={true}
          style={{
            width: "100%",
            height: "48px", 
            marginTop: "16px",
            borderRadius: "51px",
            background: "#CCCCCC",
            border: "none",
            color: "#666666",
            fontSize: "16px",
            fontWeight: 600,
            fontFamily: "var(--font-source-sans), sans-serif",
            cursor: "not-allowed",
            opacity: 0.6,
          }}
        >
          Reserve a Spot (Preview)
        </button>
      </div>
    </div>
  );
}