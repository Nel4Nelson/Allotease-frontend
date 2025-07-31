import React from "react";

interface StayDetailsTitleProps {
  title: string;
  className?: string;
}

export function StayDetailsTitle({
  title,
  className = "",
}: StayDetailsTitleProps) {
  return (
    <h1
      className={`
        text-[var(--Title,#1F2024)] 
        font-space-grotesk 
        text-[28px] 
        font-bold 
        leading-[140%] 
        tracking-[-0.56px]
        ${className}
      `}
    >
      {title}
    </h1>
  );
}
