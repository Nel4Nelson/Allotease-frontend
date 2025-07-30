import React from "react";

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionTitle({ children, className = "" }: SectionTitleProps) {
  return (
    <h2
      className={`text-[28px] font-bold leading-[110%] tracking-[-0.56px] text-[var(--Title,#1F2024)] ${className}`}
      style={{
        fontFamily: "var(--font-space-grotesk), sans-serif",
        color: "var(--Title, #1F2024)",
        fontSize: "28px",
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: "110%",
        letterSpacing: "-0.56px",
      }}
    >
      {children}
    </h2>
  );
}
