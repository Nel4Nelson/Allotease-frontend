"use client";
import React from "react";

interface FeaturedSectionHeaderProps {
  className?: string;
}

export function FeaturedSectionHeader({ className = "" }: FeaturedSectionHeaderProps) {
  return (
    <div className={`container mx-auto px-4 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h2
          style={{
            color: "var(--System-Teal, #1F3A3A)",
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "28px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "110%",
            letterSpacing: "-0.56px",
            margin: 0,
            marginBottom: "8px",
          }}
        >
          Featured Hosts
        </h2>
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
          Discover top-rated hosts and organizers you can trust. Follow them to get first dibs on their latest listings, events, and offers.
        </p>
      </div>
    </div>
  );
}