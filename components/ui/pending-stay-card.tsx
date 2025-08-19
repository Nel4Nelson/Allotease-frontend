"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

interface PendingStayCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  frequency: string;
  imageUrl: string;
  expiresAt: string; // ISO date string
  onAccept: (id: string) => void;
  onRefund: (id: string) => void;
  disabled?: boolean; // Add this optional prop
}

export function PendingStayCard({
  id,
  title,
  location,
  price,
  frequency,
  imageUrl,
  expiresAt,
  onAccept,
  onRefund,
  disabled = false, // Default to false
}: PendingStayCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  // Format price display
  const formatPrice = (price: number, frequency: string) => {
    return `NGN ${price.toLocaleString()} / ${frequency}`;
  };

  // Calculate time remaining
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const difference = expiry - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m left`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m left`);
        } else {
          setTimeLeft(`${minutes}m left`);
        }
      } else {
        setTimeLeft("completed");
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <div className="flex gap-6">
      {/* Image */}
      <div
        style={{
          borderRadius: "24px",
          width: "240px",
          height: "160px",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          style={{
            borderRadius: "24px",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
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
              marginBottom: "8px",
            }}
          >
            {title}
          </h3>

          {/* Location and Price */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span
              style={{
                color: "var(--Body, #71727A)",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "142.745%",
                letterSpacing: "-0.32px",
              }}
            >
              {location}
            </span>

            <div
              style={{
                borderRadius: "4px",
                background:
                  "var(--Outline-on-System-Teal, rgba(138, 174, 164, 0.20))",
                display: "flex",
                padding: "2px 8px",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  color: "var(--System-Teal, #1F3A3A)",
                  fontFamily: "var(--font-source-sans), sans-serif",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "142.745%",
                  letterSpacing: "-0.28px",
                }}
              >
                {formatPrice(price, frequency)}
              </span>
            </div>
          </div>

          {/* Timer */}
          <div
            style={{
              borderRadius: "54px",
              border: "1px solid var(--Rustic, #B5651D)",
              background: "#FFF3E7",
              display: "flex",
              padding: "6px 12px",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
              width: "fit-content",
            }}
          >
            <span
              style={{
                color: "var(--Rustic, #B5651D)",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "normal",
              }}
            >
              {timeLeft}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Accept/Confirm Button */}
          <button
            onClick={() => onAccept(id)}
            disabled={disabled}
            style={{
              borderRadius: "51px",
              border: "1px solid var(--Uplift-400, #15BA6B)",
              background: disabled 
                ? "rgba(21, 186, 107, 0.05)" 
                : "rgba(21, 186, 107, 0.11)",
              backdropFilter: "blur(21px)",
              display: "flex",
              padding: "8px 16px",
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
              flex: "1 0 0",
              color: disabled 
                ? "rgba(21, 186, 107, 0.5)" 
                : "var(--Uplift-400, #15BA6B)",
              fontFamily: "var(--font-source-sans), sans-serif",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              opacity: disabled ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                e.currentTarget.style.background = "rgba(21, 186, 107, 0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled) {
                e.currentTarget.style.background = "rgba(21, 186, 107, 0.11)";
              }
            }}
          >
            Accept
          </button>

          {/* Refund Button */}
          <button
            onClick={() => onRefund(id)}
            disabled={disabled}
            style={{
              borderRadius: "51px",
              border: "1px solid #FF0004",
              background: disabled 
                ? "rgba(255, 0, 4, 0.05)" 
                : "rgba(255, 0, 4, 0.11)",
              backdropFilter: "blur(21px)",
              display: "flex",
              padding: "8px 16px",
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
              flex: "1 0 0",
              color: disabled ? "rgba(255, 0, 4, 0.5)" : "#FF0004",
              fontFamily: "var(--font-source-sans), sans-serif",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              opacity: disabled ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                e.currentTarget.style.background = "rgba(255, 0, 4, 0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled) {
                e.currentTarget.style.background = "rgba(255, 0, 4, 0.11)";
              }
            }}
          >
            Refund
          </button>
        </div>
      </div>
    </div>
  );
}