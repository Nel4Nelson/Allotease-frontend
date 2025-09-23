"use client";
import React from "react";
import { ContentHeader } from "@/components/ui/content-header";

interface StayDetailsHeaderProps {
  stayTitle: string;
  onEditClick?: () => void;
  className?: string;
}

export function StayDetailsHeader({
  stayTitle,
  onEditClick,
  className = "",
}: StayDetailsHeaderProps) {
  const StayTitle = () => (
    <h1 className="text-[#1F2024] font-space-grotesk text-2xl font-bold leading-[140%] tracking-[-0.48px]">
      {stayTitle}
    </h1>
  );

  const EditStayButton = () => (
    <button
      onClick={onEditClick}
      className="flex items-center justify-center gap-[15px] px-3 py-1.5 rounded-[51px] border border-[#FF5B00] hover:bg-orange-50 transition-colors"
    >
      <span className="text-[#FF5B00] font-source-sans text-lg font-semibold">
        Edit stay details
      </span>
    </button>
  );

  return (
    <div className={className}>
      <ContentHeader title={<StayTitle />} action={<EditStayButton />} />
    </div>
  );
}
