/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Button } from "@/components/ui/button";

interface NetworkErrorProps {
  onRetry?: () => void;
  message?: string;
  className?: string;
}

export function NetworkError({ 
  onRetry, 
  message = "Unable to load content", 
  className = "" 
}: NetworkErrorProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      {/* Error Icon */}
      <div className="mb-4">
        <svg
          className="w-16 h-16 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* Error Message */}
      <h3
        style={{
          color: "#1F2024",
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "18px",
          fontWeight: 600,
          marginBottom: "8px",
        }}
      >
        {message}
      </h3>

      <p
        style={{
          color: "#71727A",
          fontFamily: "var(--font-source-sans), sans-serif",
          fontSize: "14px",
          marginBottom: "24px",
          textAlign: "center",
          maxWidth: "300px",
        }}
      >
        Please check your internet connection and try again
      </p>

      {/* Retry Button */}
      {onRetry && (
        <Button
          variant="signup-primary"
          size="allotease-md"
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
}

// Empty state component for when there's no data
interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "No results found",
  message = "Try adjusting your filters or search criteria",
  actionLabel,
  onAction,
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      {/* Icon */}
      <div className="mb-4">
        {icon || (
          <svg
            className="w-20 h-20 text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        )}
      </div>

      {/* Title */}
      <h3
        style={{
          color: "#1F2024",
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "20px",
          fontWeight: 600,
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>

      {/* Message */}
      <p
        style={{
          color: "#71727A",
          fontFamily: "var(--font-source-sans), sans-serif",
          fontSize: "16px",
          marginBottom: "24px",
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        {message}
      </p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <Button
          variant="allotease-blur"
          size="allotease-md"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// Offline state component
export function OfflineState({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      {/* Offline Icon */}
      <div className="mb-4">
        <svg
          className="w-20 h-20 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
          />
        </svg>
      </div>

      {/* Title */}
      <h3
        style={{
          color: "#1F2024",
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "20px",
          fontWeight: 600,
          marginBottom: "8px",
        }}
      >
        You're offline
      </h3>

      {/* Message */}
      <p
        style={{
          color: "#71727A",
          fontFamily: "var(--font-source-sans), sans-serif",
          fontSize: "16px",
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        Connect to the internet to view available accommodations
      </p>
    </div>
  );
}