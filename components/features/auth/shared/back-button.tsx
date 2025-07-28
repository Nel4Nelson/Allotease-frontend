import React from "react";
import { Button } from "@/components/ui/button";

const ChevronLeftIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 256 256"
    className={className}
  >
    <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
  </svg>
);

interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

export function BackButton({ onClick, className = "" }: BackButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={`
        group
        flex 
        items-center
        text-[var(--body-text)] 
        hover:text-[var(--feature-accent-orange)] 
        h-auto 
        font-normal
        font-source-sans-pro
        text-sm
        transition-all 
        duration-200 
        ease-out
        hover:bg-transparent
        focus-visible:ring-2
        focus-visible:ring-[var(--feature-accent-orange)]/20
        focus-visible:ring-offset-1
        w-[20px]
        p-0
        ${className}
      `}
    >
      <ChevronLeftIcon className="transition-transform duration-200 group-hover:-translate-x-0.5" />
    </Button>
  );
}
