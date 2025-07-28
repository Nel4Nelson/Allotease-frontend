import React from "react";

interface StayDescriptionProps {
  description: string;
  className?: string;
}

export function StayDescription({
  description,
  className = "",
}: StayDescriptionProps) {
  return (
    <p
      className={`${className}`}
      style={{
        overflow: "hidden",
        color: "var(--Body, #71727A)",
        textOverflow: "ellipsis",
        fontFamily: "var(--font-source-sans), sans-serif",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "142.745%",
        letterSpacing: "-0.32px",
        margin: 0,
        width: "100%",
        maxWidth: "100%",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        whiteSpace: "normal",
      }}
    >
      {description}
    </p>
  );
}
