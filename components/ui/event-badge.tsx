import React from "react";

interface EventBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function EventBadge({ children, className = "" }: EventBadgeProps) {
  return (
    <div
      className={`inline-flex ${className}`}
      style={{
        borderRadius: "54px",
        background: "#F2F4F7",
        display: "flex",
        padding: "4px 6px",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <span
        style={{
          color: "var(--System-Teal, #1F3A3A)",
          fontFamily: '"Source Sans Pro"',
          fontSize: "12px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "14px",
        }}
      >
        {children}
      </span>
    </div>
  );
}
