"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  percentage?: string;
  isFirstCard?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  percentage,
  isFirstCard = false,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center p-5 rounded-2xl border border-[rgba(138,174,164,0.20)]",
        isFirstCard
          ? "bg-[linear-gradient(6deg,rgba(22,244,118,0.08)_33.76%,rgba(255,255,255,0.08)_56.29%)]"
          : "bg-[rgba(242,244,247,0.30)]",
        "backdrop-blur-[21px]",
        className
      )}
      style={{
        backdropFilter: "blur(21px)",
      }}
    >
      {/* Title */}
      <h3 className="text-[#71727A] font-source-sans text-base font-semibold leading-[142.745%] tracking-[-0.32px]">
        {title}
      </h3>

      <div className="flex justify-between">
        {/* Value */}
        <div className="text-[#1F2024] text-center font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px]">
          {value}
        </div>

        {/* Percentage Badge */}
        {percentage && (
          <Badge
            variant="outline"
            className="px-2 py-0.5 justify-center items-center gap-2.5 rounded border-0 bg-[rgba(138,174,164,0.20)] text-[#1F3A3A] font-source-sans text-sm font-semibold leading-[142.745%] tracking-[-0.28px]"
          >
            {percentage}
          </Badge>
        )}
      </div>
    </div>
  );
}
