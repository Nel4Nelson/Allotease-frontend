import React from "react";
import { useStaysFormStore } from "@/stores/stay-form-store";

interface StaysTitleProps {
  className?: string;
}

export function StaysTitle({ className = "" }: StaysTitleProps) {
  const { formData } = useStaysFormStore();

  const title = formData.accommodationTitle || "Accommodation Title Preview";
  const isPlaceholder = !formData.accommodationTitle;

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