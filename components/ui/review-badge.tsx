import React from "react";
import { StarIcon } from "../icons";

interface ReviewBadgeProps {
  rating: number;
  className?: string;
}

export function ReviewBadge({ rating, className = "" }: ReviewBadgeProps) {
  return (
    <div
      className={`inline-flex items-center ${className}`}
      style={{
        borderRadius: "12px",
        border: "2px solid #93FFC2",
        background: "#13C962",
        display: "flex",
        height: "24px",
        padding: "8px",
        justifyContent: "center",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <StarIcon />
      <span
        style={{
          color: "#F2F4F7",
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "12px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "140%",
          letterSpacing: "-0.24px",
        }}
      >
        {rating.toFixed(2)}
      </span>
    </div>
  );
}
