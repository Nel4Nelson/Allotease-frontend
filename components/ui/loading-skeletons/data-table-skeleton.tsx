"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { SearchIcon } from "@/components/icons";

interface DataTableSkeletonProps {
    title?: string;
    columns?: string[];
    rowCount?: number;
    showSearch?: boolean;
    showSort?: boolean;
    showExport?: boolean;
    className?: string;
}

export function DataTableSkeleton({
    columns = ["Reservation ID", "Guest", "Room", "Dates", "Status"],
    rowCount = 5,
    showSearch = true,
    showSort = false,
    showExport = true,
    className,
}: DataTableSkeletonProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-start gap-6 rounded-xl border border-[rgba(138,174,164,0.20)] bg-[rgba(242,244,247,0.50)] pb-5",
                className
            )}
        >
            {/* Table Header */}
            <div className="flex flex-col items-start gap-6 self-stretch pt-5 px-5">
                {/* Title Skeleton */}
                <div className="h-6 w-48 bg-gray-200/60 rounded animate-pulse" />

                {/* Search, Sort, and Export Row */}
                {(showSearch || showSort || showExport) && (
                    <div className="flex items-center justify-between w-full gap-4">
                        {/* Search Bar Skeleton */}
                        {showSearch && (
                            <div className="flex items-center gap-3 h-10 max-w-[250px] px-3 flex-1 rounded-full border border-gray-300/20 bg-gray-100/50">
                                <SearchIcon />
                                <div className="h-4 w-32 bg-gray-200/60 rounded animate-pulse" />
                            </div>
                        )}

                        {/* Controls Skeleton */}
                        <div className="flex items-center gap-4">
                            {/* Sort Filter Skeleton */}
                            {showSort && (
                                <div className="h-8 w-24 bg-gray-200/60 rounded animate-pulse" />
                            )}

                            {/* Export Button Skeleton */}
                            {showExport && (
                                <div className="h-8 w-32 bg-gray-200/60 rounded-full animate-pulse" />
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Column Headers */}
            <div className="flex flex-col justify-center items-center gap-2.5 self-stretch py-4 border-b border-[rgba(138,174,164,0.20)] bg-[rgba(242,244,247,0.80)]">
                <div className="flex items-center w-full px-5">
                    {columns.map((_, index) => (
                        <div
                            key={index}
                            className={cn(
                                "text-left",
                                index === 0
                                    ? "flex-[0.8]"
                                    : index === 1
                                        ? "flex-[1.2]"
                                        : index === columns.length - 1
                                            ? "flex-[1] text-center"
                                            : "flex-1"
                            )}
                        >
                            <div className="h-4 w-20 bg-gray-200/60 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Table Body Skeletons */}
            <div className="flex flex-col justify-center items-center gap-6 self-stretch px-5">
                {Array.from({ length: rowCount }).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex items-center w-full">
                        {columns.map((_, colIndex) => (
                            <div
                                key={colIndex}
                                className={cn(
                                    "text-left",
                                    colIndex === 0
                                        ? "flex-[0.8]"
                                        : colIndex === 1
                                            ? "flex-[1.2]"
                                            : colIndex === columns.length - 1
                                                ? "flex-[1] flex justify-center"
                                                : "flex-1"
                                )}
                            >
                                {/* Different skeleton styles based on column type */}
                                {colIndex === 0 && (
                                    // ID column
                                    <div className="h-4 w-16 bg-gray-200/60 rounded animate-pulse" />
                                )}
                                {colIndex === 1 && (
                                    // Guest column with avatar
                                    <div className="flex items-center gap-2">
                                        <div className="w-[18px] h-[18px] bg-gray-200/60 rounded-full animate-pulse" />
                                        <div className="h-4 w-24 bg-gray-200/60 rounded animate-pulse" />
                                    </div>
                                )}
                                {colIndex === 2 && (
                                    // Room column
                                    <div className="h-4 w-8 bg-gray-200/60 rounded animate-pulse" />
                                )}
                                {colIndex === 3 && (
                                    // Dates column
                                    <div className="h-4 w-20 bg-gray-200/60 rounded animate-pulse" />
                                )}
                                {colIndex === columns.length - 1 && (
                                    // Status column - badge shape
                                    <div className="h-8 w-20 bg-gray-200/60 rounded-lg animate-pulse" />
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}