import React from "react";
import { useStaysFormStore } from "@/stores/stay-form-store";

interface StaysDescriptionProps {
  className?: string;
}

export function StaysDescription({ className = "" }: StaysDescriptionProps) {
  const { formData } = useStaysFormStore();

  const description =
    formData.accommodationDescription ||
    "Accommodation description will appear here. This section will provide detailed information about your property, including amenities, room features, location highlights, and what guests can expect during their stay.";
  const isPlaceholder = !formData.accommodationDescription;

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
      {description}
    </p>
  );
}
