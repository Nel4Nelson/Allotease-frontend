import React from "react";

interface TicketEventCardProps {
  title: string;
  dateTime: string;
  imageUrl: string;
  badgeText: string;
  ticketCount?: number;
  totalPrice?: number;
  status?: string;
  className?: string;
  onClick?: () => void;
  onGetTicket?: (event?: React.MouseEvent) => void;
}

export function TicketEventCard({
  title,
  dateTime,
  imageUrl,
  badgeText,
  ticketCount = 1,
  totalPrice,
  //status = "active",
  className = "",
  onClick,
  onGetTicket,
}: TicketEventCardProps) {
  // Format price display
  const formatPrice = (price?: number) => {
    if (!price || price === 0) return "Free";
    return `₦${price.toLocaleString()}`;
  };

  // Handle card click
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Handle get ticket button click
  const handleGetTicketClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    if (onGetTicket) {
      onGetTicket(event);
    }
  };

  return (
    <div
      className={`flex cursor-pointer transition-transform hover:scale-[1.02] ${className}`}
      style={{
        display: "flex",
        alignItems: "stretch", // Changed from flex-start to stretch
        height: "176px", // Fixed height to match image
        minWidth: "300px",
        gap: "12px", // Slightly increased gap
        borderRadius: "12px", // Added border radius to card
        padding: "0", // Ensure no padding interferes
        overflow: "hidden", // Prevent content overflow
      }}
      onClick={handleCardClick}
    >
      {/* Event Image */}
      <div
        style={{
          width: "300px", // Reduced width for better proportion
          height: "176px",
          borderRadius: "12px", // Only left corners rounded
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "lightgray",
          flexShrink: 0,
        }}
      />

      {/* Content Section */}
      <div 
        className="flex-1 flex flex-col justify-between" 
        style={{
          padding: "16px 16px 16px 0", // Add padding, but not on left since we have gap
          height: "100%", // Ensure full height
        }}
      >
        {/* Top Content */}
        <div className="flex flex-col gap-1">
          {/* Title */}
          <h3
            style={{
              color: "var(--Title, #1F2024)",
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "140%",
              letterSpacing: "-0.32px",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {title}
          </h3>

          {/* Date and Time */}
          <p
            style={{
              color: "var(--Body, #71727A)",
              fontFamily: "var(--font-source-sans), sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "142.745%",
              letterSpacing: "-0.28px",
              margin: 0,
            }}
          >
            {dateTime}
          </p>

          {/* Ticket Info */}
          <div className="flex items-center gap-2 mt-2">
            {/* Badge */}
            <span
              style={{
                display: "inline-flex",
                padding: "2px 8px",
                alignItems: "center",
                gap: "10px",
                borderRadius: "51px",
                background: "var(--Green, #13C962)",
                color: "white",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                lineHeight: "normal",
              }}
            >
              {badgeText}
            </span>

            {/* Ticket Count */}
            <span
              style={{
                color: "var(--Body, #71727A)",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: "normal",
              }}
            >
              {ticketCount} ticket{ticketCount !== 1 ? "s" : ""}
            </span>

            {/* Total Price */}
            {totalPrice && totalPrice > 0 && (
              <span
                style={{
                  color: "var(--Title, #1F2024)",
                  fontFamily: "var(--font-source-sans), sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  lineHeight: "normal",
                }}
              >
                {formatPrice(totalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Get Ticket Button - positioned at bottom */}
        <button
          onClick={handleGetTicketClick}
          style={{
            display: "flex",
            padding: "8px 16px",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            borderRadius: "51px",
            border: "1px solid #FF5B06",
            background: "transparent",
            color: "#FF5B06",
            fontFamily: "var(--font-source-sans), sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: "normal",
            cursor: "pointer",
            transition: "all 0.2s ease",
            flexShrink: 0,
            marginTop: "auto", // Push to bottom
            width: "fit-content", // Don't stretch full width
            alignSelf: "flex-start", // Align to left
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#FF5B06";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#FF5B06";
          }}
        >
          Get another ticket
        </button>
      </div>
    </div>
  );
}