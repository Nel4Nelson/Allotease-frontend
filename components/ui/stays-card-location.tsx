import React from "react";

interface StayLocationProps {
  location: string;
  className?: string;
}

export function StayLocation({ location, className = "" }: StayLocationProps) {
  return (
    <p
      className={className}
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
      {location}
    </p>
  );
}
