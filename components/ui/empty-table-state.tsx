"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyTableStateProps {
    type: "no_data" | "no_results" | "network_error" | "generic_error";
    title?: string;
    message?: string;
    onRetry?: () => void;
    onClearFilters?: () => void;
    className?: string;
}

// Icons for different empty states
const NoDataIcon = () => (
    <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-gray-300"
    >
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
        <path d="M16 18h.01" />
    </svg>
);

const SearchIcon = () => (
    <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-gray-300"
    >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
    </svg>
);

const NetworkErrorIcon = () => (
    <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-gray-300"
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
);

const ErrorIcon = () => (
    <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-gray-300"
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
);

export function EmptyTableState({
    type,
    title,
    message,
    onRetry,
    onClearFilters,
    className,
}: EmptyTableStateProps) {
    const getEmptyStateConfig = () => {
        switch (type) {
            case "no_data":
                return {
                    icon: <NoDataIcon />,
                    title: title || "No reservations yet",
                    message: message || "When guests make reservations, they'll appear here.",
                    showRetry: false,
                    showClearFilters: false,
                };

            case "no_results":
                return {
                    icon: <SearchIcon />,
                    title: title || "No results found",
                    message: message || "Try adjusting your search or filters to find what you're looking for.",
                    showRetry: false,
                    showClearFilters: true,
                };

            case "network_error":
                return {
                    icon: <NetworkErrorIcon />,
                    title: title || "Connection problem",
                    message: message || "Unable to load reservations. Please check your internet connection.",
                    showRetry: true,
                    showClearFilters: false,
                };

            case "generic_error":
            default:
                return {
                    icon: <ErrorIcon />,
                    title: title || "Something went wrong",
                    message: message || "We're having trouble loading your reservations. Please try again.",
                    showRetry: true,
                    showClearFilters: false,
                };
        }
    };

    const config = getEmptyStateConfig();

    return (
        <div className={cn("flex flex-col items-center justify-center py-16 px-8", className)}>
            {/* Icon */}
            <div className="mb-6">
                {config.icon}
            </div>

            {/* Title */}
            <h3 className="text-[#1F2024] font-space-grotesk text-lg font-semibold mb-2 text-center">
                {config.title}
            </h3>

            {/* Message */}
            <p className="text-[#71727A] font-source-sans text-base text-center max-w-md mb-6 leading-6">
                {config.message}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
                {config.showRetry && onRetry && (
                    <Button
                        variant="outline"
                        onClick={onRetry}
                        className="px-4 py-2"
                    >
                        Try Again
                    </Button>
                )}

                {config.showClearFilters && onClearFilters && (
                    <Button
                        variant="outline"
                        onClick={onClearFilters}
                        className="px-4 py-2"
                    >
                        Clear Filters
                    </Button>
                )}
            </div>
        </div>
    );
}