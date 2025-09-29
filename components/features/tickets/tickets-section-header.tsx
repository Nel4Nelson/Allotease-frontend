import React from "react";

interface TicketsSectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function TicketsSectionHeader({
  title,
  subtitle,
  className = "",
}: TicketsSectionHeaderProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Main Title */}
      <h1
        style={{
          color: "var(--Title, #1F2024)",
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "24px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "140%", // 33.6px
          letterSpacing: "-0.48px",
          margin: 0,
        }}
      >
        {title}
      </h1>

      {/* Subtitle (optional) */}
      {subtitle && (
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
          {subtitle}
        </p>
      )}
    </div>
  );
}