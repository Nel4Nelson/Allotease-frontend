import React from "react";
import { BackButton } from "./back-button";

interface AuthHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function AuthHeader({
  title,
  showBackButton = true,
  onBack,
}: AuthHeaderProps) {
  // If no back button, use centered layout
  if (!showBackButton || !onBack) {
    return (
      <div className="mb-4">
        <h1
          className="
            font-space-grotesk 
            font-bold 
            text-center 
            text-[var(--title-color)]
            text-lg sm:text-xl
            leading-[140%] 
            tracking-[-0.4px]
            transition-all 
            duration-300
            px-4 sm:px-0
          "
        >
          {title}
        </h1>
      </div>
    );
  }

  // If back button is shown, use flex layout
  return (
    <div className="mb-4 flex gap-3">
      {/* Back Button */}
      <BackButton onClick={onBack} />

      {/* Title */}
      <h1
        className="
        w-full
          font-space-grotesk 
          font-bold 
          text-center 
          text-[var(--title-color)]
          text-lg sm:text-xl
          leading-[140%] 
          tracking-[-0.4px]
          transition-all 
          duration-300
          px-4 sm:px-0
        "
      >
        {title}
      </h1>
    </div>
  );
}
