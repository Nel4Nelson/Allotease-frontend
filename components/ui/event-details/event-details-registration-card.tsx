"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Event } from "@/services/events-service";
import { EventRegistrationModal } from "@/components/ui/modals/event-registration-modal";
import { useEventBookingStore } from "@/stores/event-booking-store";

interface EventDetailsRegistrationCardProps {
  event: Event;
  availableCapacity: number;
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

export function EventDetailsRegistrationCard({
  event,
  availableCapacity,
  className = "",
}: EventDetailsRegistrationCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    bookingData, 
    setEventId, 
    setNumberOfTickets 
  } = useEventBookingStore();

  // Check if event is free
  const isFreeEvent = event.price === 0;

  // Set event ID when component mounts
  useEffect(() => {
    setEventId(event._id);
  }, [event._id, setEventId]);

  // Format end date for ticket sales
  const formatTicketSalesEndDate = (startTime: string) => {
    const date = new Date(startTime);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return `Ticket sales ends ${date.toLocaleDateString("en-US", options)}`;
  };

  // Format price
  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `₦${price.toLocaleString()}`;
  };

  // Handle quantity change
  const handleDecrement = () => {
    if (bookingData.numberOfTickets > 1) {
      setNumberOfTickets(bookingData.numberOfTickets - 1);
    }
  };

  const handleIncrement = () => {
    if (bookingData.numberOfTickets < availableCapacity) {
      setNumberOfTickets(bookingData.numberOfTickets + 1);
    }
  };

  // Handle registration - open modal
  const handleReservation = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Get button text based on event price
  const getButtonText = () => {
    return isFreeEvent ? "Book event for free" : "Reserve a Spot";
  };

  return (
    <>
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
            {formatTicketSalesEndDate(event.startTime)}
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
                disabled={bookingData.numberOfTickets <= 1}
                style={{
                  borderRadius: "50%",
                  border: "0.778px solid rgba(138, 174, 164, 0.50)",
                  display: "flex",
                  width: "28px",
                  height: "28px",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "transparent",
                  cursor: bookingData.numberOfTickets <= 1 ? "not-allowed" : "pointer",
                  opacity: bookingData.numberOfTickets <= 1 ? 0.5 : 1,
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
                {bookingData.numberOfTickets}
              </span>

              <button
                onClick={handleIncrement}
                disabled={bookingData.numberOfTickets >= availableCapacity}
                style={{
                  borderRadius: "50%",
                  border: "0.778px solid rgba(138, 174, 164, 0.50)",
                  display: "flex",
                  width: "28px",
                  height: "28px",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "transparent",
                  cursor:
                    bookingData.numberOfTickets >= availableCapacity ? "not-allowed" : "pointer",
                  opacity: bookingData.numberOfTickets >= availableCapacity ? 0.5 : 1,
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
              {formatPrice(event.price * bookingData.numberOfTickets)}
            </span>
          </div>

          {/* Reserve Button */}
          <Button
            variant="signup-primary"
            size="allotease-md"
            onClick={handleReservation}
            style={{
              width: "100%",
              height: "48px", 
              marginTop: "16px",
              borderRadius: "51px",
              background: "#FF5B06",
              border: "none",
              color: "white",
              fontSize: "16px",
              fontWeight: 600,
              fontFamily: "var(--font-source-sans), sans-serif",
              cursor: "pointer",
            }}
          >
            {getButtonText()}
          </Button>
        </div>
      </div>

      {/* Registration Modal */}
      <EventRegistrationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={event}
      />
    </>
  );
}