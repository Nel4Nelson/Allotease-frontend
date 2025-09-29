"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface TruncatedIdProps {
    fullId: string;
    prefix?: string;
    className?: string;
}

export function TruncatedId({
    fullId,
    prefix = "RES-",
    className
}: TruncatedIdProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    // Extract 4 unique characters from the ID
    const getTruncatedId = (id: string): string => {
        // For MongoDB ObjectIds, take characters from different positions for uniqueness
        // This ensures we get varied characters across different IDs
        const chars = id.slice(-8, -4); // Take 4 chars from near the end
        return `${prefix}${chars.toUpperCase()}`;
    };

    const truncatedId = getTruncatedId(fullId);

    return (
        <div className="relative inline-block">
            <span
                className={cn(
                    "text-[#71727A] font-source-sans text-base font-normal leading-6 tracking-[-0.32px] cursor-help",
                    className
                )}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                {truncatedId}
            </span>

            {/* Tooltip */}
            {showTooltip && (
                <div className="absolute bottom-full left-0 mb-2 z-50">
                    <div className="px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
                        {fullId}
                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
                    </div>
                </div>
            )}
        </div>
    );
}