"use client";
import React from "react";
import { cn } from "@/lib/utils";

export type TimeframeValue = "day" | "week" | "month";

interface TimeframeOption {
    value: TimeframeValue;
    label: string;
    shortLabel: string;
}

const timeframeOptions: TimeframeOption[] = [
    { value: "day", label: "Daily", shortLabel: "Day" },
    { value: "week", label: "Weekly", shortLabel: "Week" },
    { value: "month", label: "Monthly", shortLabel: "Month" },
];

interface TimeframeSelectorProps {
    value: TimeframeValue;
    onChange: (value: TimeframeValue) => void;
    className?: string;
}

export function TimeframeSelector({
    value,
    onChange,
    className,
}: TimeframeSelectorProps) {
    return (
        <div
            className={cn(
                "flex items-center gap-1 sm:gap-2 p-0.5 sm:p-1 h-[38px] sm:h-[45px] rounded-[10px] border border-[rgba(138,174,164,0.2)] bg-[rgba(242,244,247,0.3)]",
                className
            )}
            style={{
                backdropFilter: "blur(21px)",
            }}
        >
            {timeframeOptions.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={cn(
                        "flex items-center justify-center h-[32px] sm:h-[37px] px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border-none cursor-pointer transition-all duration-200",
                        "font-source-sans text-sm sm:text-lg font-semibold leading-normal",
                        value === option.value
                            ? "bg-[linear-gradient(267deg,#FFF3E7_-49.46%,#FFF_97.79%)] text-[#1F2024] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.04)]"
                            : "bg-transparent text-[#71727A] hover:bg-[rgba(255,255,255,0.5)]"
                    )}
                >
                    <span className="sm:hidden">{option.shortLabel}</span>
                    <span className="hidden sm:inline">{option.label}</span>
                </button>
            ))}
        </div>
    );
}