import React from "react";

interface StayDetailsDescriptionProps {
  description: string;
  className?: string;
}

export function StayDetailsDescription({
  description,
  className = "",
}: StayDetailsDescriptionProps) {
  const hasDescription = description && description.trim().length > 0;

  const displayText = hasDescription
    ? description
    : "No description available for this accommodation.";

  return (
    <p
      className={`
        text-[var(--Body,#71727A)] 
        font-source-sans-pro 
        text-base 
        font-normal 
        leading-[142.745%] 
        tracking-[-0.32px]
        ${!hasDescription ? "text-gray-400 italic" : ""}
        ${className}
      `}
    >
      {displayText}
    </p>
  );
}
