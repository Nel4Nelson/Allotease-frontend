import React from "react";
import { useEventFormStore } from "@/stores/event-form-store";

interface EventTitleProps {
  className?: string;
}

export function EventTitle({ className = "" }: EventTitleProps) {
  const { formData } = useEventFormStore();

  const title = formData.eventTitle || "Event Title Preview";
  const isPlaceholder = !formData.eventTitle;

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
      {title}
    </h1>
  );
}
