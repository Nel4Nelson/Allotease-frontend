"use client";
import React from "react";
import { Button } from "@/components/ui/button";

interface ShowMoreSectionProps {
  showMoreButton?: boolean;
  showCollapseButton?: boolean;
  onShowMore?: () => void;
  onCollapse?: () => void;
  isLoading?: boolean;
  loadingText?: string;
  showMoreText?: string;
  collapseText?: string;
  statusInfo?: {
    currentCount: number;
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
  className?: string;
}

export function ShowMoreSection({
  showMoreButton = false,
  showCollapseButton = false,
  onShowMore,
  onCollapse,
  isLoading = false,
  loadingText = "Loading more...",
  showMoreText = "Show more",
  collapseText = "Collapse",
  statusInfo,
  className = "",
}: ShowMoreSectionProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{loadingText}</span>
          </div>
        </div>
      )}

      {/* Status info */}
      {statusInfo && statusInfo.totalPages > 1 && (
        <div className="flex justify-center text-sm text-gray-500">
          <span>
            Showing {statusInfo.currentCount} of {statusInfo.totalCount}{" "}
            items ({statusInfo.currentPage} of {statusInfo.totalPages} pages loaded)
          </span>
        </div>
      )}

      {/* Action Buttons */}
      {(showMoreButton || showCollapseButton) && (
        <div className="flex justify-center gap-4 pt-4">
          {showMoreButton && (
            <Button
              variant="signup-primary"
              size="allotease-md"
              onClick={onShowMore}
              disabled={isLoading}
              loading={isLoading}
            >
              {showMoreText}
            </Button>
          )}

          {showCollapseButton && (
            <Button
              variant="allotease-blur"
              size="allotease-md"
              onClick={onCollapse}
              disabled={isLoading}
            >
              {collapseText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}