import React from "react";
import { cn } from "@/lib/utils";

interface StatCardSkeletonProps {
    isFirstCard?: boolean;
    className?: string;
}

export function StatCardSkeleton({ isFirstCard = false, className }: StatCardSkeletonProps) {
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
            {/* Title Skeleton */}
            <div className="mb-3">
                <div className="h-4 w-32 bg-gray-200/60 rounded animate-pulse" />
            </div>

            <div className="flex justify-between items-center">
                {/* Value Skeleton */}
                <div className="h-6 w-20 bg-gray-200/60 rounded animate-pulse" />

                {/* Percentage Badge Skeleton */}
                <div className="h-6 w-12 bg-gray-200/60 rounded animate-pulse" />
            </div>
        </div>
    );
}