"use client";
import React from "react";
import { cn } from "@/lib/utils";

// Pagination Arrow Icons
const ChevronLeftIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="15,18 9,12 15,6" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="9,18 15,12 9,6" />
    </svg>
);

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
    totalItems?: number;
    itemsPerPage?: number;
    className?: string;
    showInfo?: boolean; // Show "Showing X of Y results"
    disabled?: boolean; // Disable all pagination controls
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    hasNextPage,
    hasPrevPage,
    totalItems,
    itemsPerPage = 10,
    className,
    showInfo = true,
    disabled = false,
}: PaginationProps) {
    // Generate page numbers to display
    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show smart pagination with ellipsis
            if (currentPage <= 3) {
                // Show first pages
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Show last pages
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                // Show middle pages
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = generatePageNumbers();

    // Calculate showing info
    const getShowingInfo = () => {
        if (!totalItems) return null;

        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);

        return `Showing ${startItem}-${endItem} of ${totalItems} results`;
    };

    const handlePageClick = (page: number | string) => {
        if (disabled || typeof page === 'string') return;
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
        }
    };

    const handlePrevious = () => {
        if (disabled || !hasPrevPage) return;
        onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (disabled || !hasNextPage) return;
        onPageChange(currentPage + 1);
    };

    // Don't render if there's only one page or no pages
    if (totalPages <= 1) return null;

    return (
        <div className={cn("flex items-center justify-between w-full", className)}>
            {/* Showing info */}
            {showInfo && (
                <div className="text-[#71727A] font-source-sans text-sm">
                    {getShowingInfo()}
                </div>
            )}

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
                {/* Previous button */}
                <button
                    onClick={handlePrevious}
                    disabled={disabled || !hasPrevPage}
                    className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg border transition-colors",
                        disabled || !hasPrevPage
                            ? "border-gray-200 text-gray-400 cursor-not-allowed"
                            : "border-[rgba(138,174,164,0.20)] text-[#71727A] hover:bg-[rgba(242,244,247,0.50)] hover:border-[rgba(138,174,164,0.40)]"
                    )}
                >
                    <ChevronLeftIcon />
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {pageNumbers.map((page, index) => {
                        if (page === '...') {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="flex items-center justify-center w-8 h-8 text-[#71727A] font-source-sans text-sm"
                                >
                                    ...
                                </span>
                            );
                        }

                        const isActive = page === currentPage;

                        return (
                            <button
                                key={page}
                                onClick={() => handlePageClick(page)}
                                disabled={disabled}
                                className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-lg border font-source-sans text-sm font-medium transition-colors",
                                    disabled
                                        ? "cursor-not-allowed opacity-50"
                                        : isActive
                                            ? "border-[#16F476] bg-[#16F476]/10 text-[#0A9355]"
                                            : "border-[rgba(138,174,164,0.20)] text-[#71727A] hover:bg-[rgba(242,244,247,0.50)] hover:border-[rgba(138,174,164,0.40)]"
                                )}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>

                {/* Next button */}
                <button
                    onClick={handleNext}
                    disabled={disabled || !hasNextPage}
                    className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg border transition-colors",
                        disabled || !hasNextPage
                            ? "border-gray-200 text-gray-400 cursor-not-allowed"
                            : "border-[rgba(138,174,164,0.20)] text-[#71727A] hover:bg-[rgba(242,244,247,0.50)] hover:border-[rgba(138,174,164,0.40)]"
                    )}
                >
                    <ChevronRightIcon />
                </button>
            </div>
        </div>
    );
}