import React from "react";

interface EventDetailsDescriptionProps {
  description: string;
  className?: string;
}

export function EventDetailsDescription({
  description,
  className = "",
}: EventDetailsDescriptionProps) {
  const displayDescription =
    description ||
    "Event description will appear here. This section will provide detailed information about your event, including what attendees can expect, key topics to be covered, and any special features or activities planned.";
  const isPlaceholder = !description;

  return (
    <p
      className={`
        text-[var(--Body,#71727A)] 
        font-source-sans-pro 
        text-base 
        font-normal 
        leading-[142.745%] 
        tracking-[-0.32px]
        ${isPlaceholder ? "text-gray-400" : ""}
        ${className}
      `}
    >
      {displayDescription}
    </p>
  );
}
