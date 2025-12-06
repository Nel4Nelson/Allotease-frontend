import React from "react";
import { StatusFilter } from "@/components/ui/filters/status-filter";

interface TicketsSectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  showStatusFilter?: boolean;
  selectedStatus?: "all" | "active" | "expired";
  onStatusChange?: (status: "all" | "active" | "expired") => void;
}

export function TicketsSectionHeader({
  title,
  subtitle,
  className = "",
  showStatusFilter = false,
  selectedStatus = "all",
  onStatusChange,
}: TicketsSectionHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      {/* Left: Title and Subtitle */}
      <div className="space-y-2 flex-1">
        {/* Main Title */}
        <h1
          style={{
            color: "var(--Title, #1F2024)",
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "140%",
            letterSpacing: "-0.48px",
            margin: 0,
          }}
        >
          {title}
        </h1>

        {/* Subtitle (optional) */}
        {subtitle && (
          <p
            style={{
              color: "var(--Body, #71727A)",
              fontFamily: "var(--font-source-sans), sans-serif",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "142.745%",
              letterSpacing: "-0.32px",
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Right: Status Filter (optional) */}
      {showStatusFilter && onStatusChange && (
        <div className="flex-shrink-0">
          <StatusFilter 
            value={selectedStatus} 
            onValueChange={onStatusChange} 
          />
        </div>
      )}
    </div>
  );
}