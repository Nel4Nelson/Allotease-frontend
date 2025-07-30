import React from "react";

interface BusinessNameProps {
  name: string;
  className?: string;
}

export function BusinessName({ name, className = "" }: BusinessNameProps) {
  return (
    <h3
      className={`flex-1 ${className}`}
      style={{
        overflow: "hidden",
        color: "var(--Title, #1F2024)",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontFamily: "var(--font-space-grotesk), sans-serif",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: "140%",
        letterSpacing: "-0.28px",
        margin: 0,
      }}
    >
      {name}
    </h3>
  );
}
