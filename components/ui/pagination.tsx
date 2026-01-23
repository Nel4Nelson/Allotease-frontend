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

// Chevron Down Icon for dropdown
const ChevronDownIcon = () => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="6,9 12,15 18,9" />
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
    onItemsPerPageChange?: (items: number) => void;
    className?: string;
    showInfo?: boolean;
    disabled?: boolean;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    hasNextPage,
    hasPrevPage,
    totalItems,
    itemsPerPage = 10,
    onItemsPerPageChange,
    className,
    showInfo = true,
    disabled = false,
}: PaginationProps) {
    // Available items per page options
    const itemsPerPageOptions = [5, 10, 15, 20];

    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        const maxVisiblePagesMobile = 3;

        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const maxPages = isMobile ? maxVisiblePagesMobile : maxVisiblePages;

        if (totalPages <= maxPages) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (isMobile) {
                if (currentPage === 1) {
                    pages.push(1, 2, '...', totalPages);
                } else if (currentPage === totalPages) {
                    pages.push(1, '...', totalPages - 1, totalPages);
                } else {
                    pages.push(1, '...', currentPage, '...', totalPages);
                }
            } else {
                // Desktop: Show more pages
                if (currentPage <= 3) {
                    pages.push(1, 2, 3, 4, '...', totalPages);
                } else if (currentPage >= totalPages - 2) {
                    pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                } else {
                    pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
                }
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

        return `Showing ${startItem}-${endItem} of ${totalItems}`;
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

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (disabled || !onItemsPerPageChange) return;
        const newItemsPerPage = parseInt(event.target.value, 10);
        onItemsPerPageChange(newItemsPerPage);
    };

    // Don't render pagination controls if there's only one page
    const showPaginationControls = totalPages > 1;

    return (
        <div className={cn(
            "flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 sm:gap-0",
            className
        )}>
            {/* Showing info with items per page selector */}
            {showInfo && (
                <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-5">
                        <div className="text-[#71727A] font-source-sans text-xs sm:text-sm">
                            {getShowingInfo()}
                        </div>

                        {/* Items per page selector */}
                        {onItemsPerPageChange && (
                            <div className="flex items-center gap-2">
                                <span className="text-[#71727A] font-source-sans text-xs sm:text-sm whitespace-nowrap">
                                    Show:
                                </span>
                                <div className="relative">
                                    <select
                                        value={itemsPerPage}
                                        onChange={handleItemsPerPageChange}
                                        disabled={disabled}
                                        className={cn(
                                            "appearance-none bg-white border border-[rgba(138,174,164,0.20)] rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 pr-6 sm:pr-8 text-[#71727A] font-source-sans text-xs sm:text-sm font-medium transition-colors cursor-pointer",
                                            disabled
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:border-[rgba(138,174,164,0.40)] focus:outline-none focus:ring-2 focus:ring-[#16F476]/20 focus:border-[#16F476]"
                                        )}
                                    >
                                        {itemsPerPageOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#71727A]">
                                        <ChevronDownIcon />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>


                </div>
            )}

            {/* Pagination controls - only show if more than 1 page */}
            {showPaginationControls && (
                <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-center sm:justify-end">
                    {/* Previous button */}
                    <button
                        onClick={handlePrevious}
                        disabled={disabled || !hasPrevPage}
                        className={cn(
                            "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border transition-colors",
                            disabled || !hasPrevPage
                                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                : "border-[rgba(138,174,164,0.20)] text-[#71727A] hover:bg-[rgba(242,244,247,0.50)] hover:border-[rgba(138,174,164,0.40)]"
                        )}
                    >
                        <ChevronLeftIcon />
                    </button>

                    {/* Page numbers */}
                    <div className="flex items-center gap-0.5 sm:gap-1">
                        {pageNumbers.map((page, index) => {
                            if (page === '...') {
                                return (
                                    <span
                                        key={`ellipsis-${index}`}
                                        className="flex items-center justify-center w-6 sm:w-8 h-7 sm:h-8 text-[#71727A] font-source-sans text-xs sm:text-sm"
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
                                        "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border font-source-sans text-xs sm:text-sm font-medium transition-colors",
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
                            "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border transition-colors",
                            disabled || !hasNextPage
                                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                : "border-[rgba(138,174,164,0.20)] text-[#71727A] hover:bg-[rgba(242,244,247,0.50)] hover:border-[rgba(138,174,164,0.40)]"
                        )}
                    >
                        <ChevronRightIcon />
                    </button>
                </div>
            )}
        </div>
    );
}