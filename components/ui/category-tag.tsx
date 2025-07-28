import React from "react";
import { CategoryTagIcon } from "../icons";

interface CategoryTagProps {
  label: string;
  onClick?: () => void;
  className?: string;
  showIcon?: boolean;
}

export function CategoryTag({
  label,
  onClick,
  className = "",
  showIcon = true,
}: CategoryTagProps) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`
        flex items-center justify-center gap-2.5 px-3 py-1.5 rounded-[54px] 
        bg-[#F2F4F7] text-(--color-dark-slate) font-source-sans-pro text-sm 
        font-normal leading-normal capitalize
        ${onClick ? "hover:bg-[#E5E7EB] transition-colors cursor-pointer" : ""}
        ${className}
      `}
    >
      {showIcon && <CategoryTagIcon />}
      <span>{label}</span>
    </Component>
  );
}
