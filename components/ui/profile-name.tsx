"use client";
import React from "react";

interface ProfileNameProps {
  name: string;
  className?: string;
}

export function ProfileName({ name, className = "" }: ProfileNameProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <h1
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
        {name}
      </h1>
    </div>
  );
}
