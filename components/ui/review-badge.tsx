import React from "react";
import { StarIcon } from "../icons";

interface ReviewBadgeProps {
  rating: number;
  className?: string;
}

export function ReviewBadge({ rating, className = "" }: ReviewBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-1 px-2 h-6 ${className}`}
      style={{
        borderRadius: "12px",
        border: "2px solid #93FFC2",
        background: "#13C962",
      }}
    >
      <span className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0">
        <StarIcon />
      </span>
      <span
        style={{
          color: "#F2F4F7",
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "12px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "140%",
          letterSpacing: "-0.24px",
          whiteSpace: "nowrap",
        }}
      >
        {rating.toFixed(2)}
      </span>
    </div>
  );
}