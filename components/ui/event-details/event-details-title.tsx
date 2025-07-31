import React from "react";

interface EventDetailsTitleProps {
  title: string;
  className?: string;
}

export function EventDetailsTitle({ title, className = "" }: EventDetailsTitleProps) {
  const displayTitle = title || "Event Title";
  const isPlaceholder = !title;

  return (
    <h1
      className={`
        text-[var(--Title,#1F2024)] 
        font-space-grotesk 
        text-[28px] 
        font-bold 
        leading-[140%] 
        tracking-[-0.56px]
        ${isPlaceholder ? "text-gray-400" : ""}
        ${className}
      `}
    >
      {displayTitle}
    </h1>
  );
}