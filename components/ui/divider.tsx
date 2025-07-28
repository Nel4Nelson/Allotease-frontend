import React from "react";

interface DividerProps {
  className?: string;
}

export function Divider({ className = "" }: DividerProps) {
  return (
    <div className={`w-full ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="2"
        viewBox="0 0 565 2"
        fill="none"
        preserveAspectRatio="none"
      >
        <path d="M0 1H565" stroke="#8AAEA4" strokeOpacity="0.3" />
      </svg>
    </div>
  );
}
