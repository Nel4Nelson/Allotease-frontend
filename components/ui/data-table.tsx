/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { FallbackImage } from "@/components/ui/fallback-image";
import { cn } from "@/lib/utils";
import { AwaitingConfirmationIcon, SearchIcon, TimedOutIcon } from "@/components/icons";

import {
  CancelledIcon,
  ConfirmedIcon,
  PendingIcon,
  TicketIconGreen,
} from "../icons";
import { TimeSortFilter } from "./filters/time-sort-filter";
import { TruncatedId } from "./truncated-id";
import { EmptyTableState } from "./empty-table-state";

// Export Icon Component
const ExportIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="7,10 12,15 17,10"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="12"
      y1="15"
      x2="12"
      y2="3"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Status Badge Component
interface StatusBadgeProps {
  status: string;
  variant?: "reservations" | "events" | "withdrawal";
}

function StatusBadge({ status, variant = "reservations" }: StatusBadgeProps) {
  const getStatusConfig = () => {
    const normalizedStatus = status.toLowerCase();

    if (variant === "reservations") {
      switch (normalizedStatus) {
        case "pending":
          return {
            icon: <PendingIcon />,
            bgColor: "#FEEDD6",
            textColor: "#F07C29",
            text: "Pending",
          };
        case "awaiting_confirmation":
          return {
            icon: <AwaitingConfirmationIcon />,
            bgColor: "#FEEDD6",
            textColor: "#F07C29",
            text: "Awaiting Confirmation",
          };
        case "confirmed":
        case "active":
          return {
            icon: <ConfirmedIcon />,
            bgColor: "#ECFDF3",
            textColor: "#0A9355",
            text: "Confirmed",
          };
        case "completed":
          return {
            icon: <ConfirmedIcon />,
            bgColor: "#ECFDF3",
            textColor: "#0A9355",
            text: "Completed",
          };
        case "cancelled":
          return {
            icon: <CancelledIcon />,
            bgColor: "#FFE2E7",
            textColor: "#EB4244",
            text: "Cancelled",
          };
        case "timed_out":
          return {
            icon: <TimedOutIcon />,
            bgColor: "#F3F4F6",
            textColor: "#6B7280",
            text: "Timed Out",
          };
        default:
          return {
            icon: null,
            bgColor: "#F3F4F6",
            textColor: "#6B7280",
            text: status,
          };
      }
    }

    if (variant === "withdrawal") {
      switch (normalizedStatus) {
        case "pending":
          return {
            icon: <PendingIcon />,
            bgColor: "#FEEDD6",
            textColor: "#F07C29",
            text: "Pending",
          };
        case "declined":
          return {
            icon: <CancelledIcon />,
            bgColor: "#FFE2E7",
            textColor: "#EB4244",
            text: "Declined",
          };
        case "paid":
          return {
            icon: <ConfirmedIcon />,
            bgColor: "#ECFDF3",
            textColor: "#0A9355",
            text: "Paid",
          };
        default:
          return {
            icon: null,
            bgColor: "#F3F4F6",
            textColor: "#6B7280",
            text: status,
          };
      }
    }

    return {
      icon: null,
      bgColor: "#F3F4F6",
      textColor: "#6B7280",
      text: status,
    };
  };

  const config = getStatusConfig();

  return (
    <div
      className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg"
      style={{ backgroundColor: config.bgColor }}
    >
      {config.icon}
      <span
        className="font-source-sans text-sm font-semibold leading-[14px] whitespace-nowrap"
        style={{ color: config.textColor }}
      >
        {config.text}
      </span>
    </div>
  );
}

export { StatusBadge };

// Column Configuration Types
export interface ColumnConfig {
  key: string;
  label: string;
  type: "text" | "guest" | "status" | "tickets" | "truncated_id" | "custom";
  render?: (value: any, row: any) => React.ReactNode;
}

export interface DataTableProps {
  title: string;
  columns: ColumnConfig[];
  data: any[];
  variant?: "reservations" | "events" | "withdrawal" | "generic";
  className?: string;
  // Optional enhancement props
  showSearch?: boolean;
  showSort?: boolean;
  showExport?: boolean;
  searchPlaceholder?: string;
  onExport?: () => void;
  // Loading and empty states
  isLoading?: boolean;
  isEmpty?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
  onClearSearch?: () => void;
  // Row click handler
  onRowClick?: (row: any) => void;
}

export function DataTable({
  title,
  columns,
  data,
  variant = "generic",
  className,
  showSearch = false,
  showSort = false,
  showExport = false,
  searchPlaceholder = "Search by address",
  onExport,
  isLoading = false,
  isEmpty = false,
  hasError = false,
  onRetry,
  onClearSearch,
  onRowClick,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortValue, setSortValue] = useState("newest");

  // Filter data based on search query (only if search is enabled)
  const filteredData =
    showSearch && searchQuery
      ? data.filter((row) => {
        return columns.some((column) => {
          const value = row[column.key];
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchQuery.toLowerCase());
          }
          return false;
        });
      })
      : data;

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      console.log("Export table data:", filteredData);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (onClearSearch) {
      onClearSearch();
    }
  };

  const renderCell = (column: ColumnConfig, value: any, row: any) => {
    if (column.render) {
      return column.render(value, row);
    }

    switch (column.type) {
      case "truncated_id":
        return (
          <TruncatedId
            fullId={value}
            prefix="RES-"
            className="text-[#71727A] font-source-sans text-base font-normal leading-6 tracking-[-0.32px]"
          />
        );

      case "guest":
        return (
          <div className="flex items-center gap-2">
            <div className="flex justify-center items-center flex-shrink-0 rounded-full overflow-hidden p-1">
              <FallbackImage
                src={row.avatar || "/icons/encircle-star-green-avatar.svg"}
                fallbackSrc="/icons/encircle-star-green-avatar.svg"
                alt={`${value} avatar`}
                fallbackAlt="Guest Avatar"
                width={18}
                height={18}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[#1F2024] font-source-sans text-base font-semibold leading-6 tracking-[-0.32px]">
              {value}
            </span>
          </div>
        );

      case "tickets":
        return (
          <div className="flex items-center gap-1 flex-wrap">
            {Array.isArray(value) ? (
              value.map((ticket, index) => (
                <div
                  key={index}
                  className="flex items-center gap-0.5 px-1 py-0.5 rounded-lg border border-[#0A9355] bg-[#ECFDF3]"
                >
                  <TicketIconGreen />
                  <span className="text-[#0A9355] font-source-sans text-sm font-semibold leading-[14px]">
                    {ticket}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-0.5 px-1 py-0.5 rounded-lg border border-[#0A9355] bg-[#ECFDF3]">
                <TicketIconGreen />
                <span className="text-[#0A9355] font-source-sans text-sm font-semibold leading-[14px]">
                  {value}
                </span>
              </div>
            )}
          </div>
        );

      case "status":
        return (
          <StatusBadge
            status={value}
            variant={variant as "reservations" | "events" | "withdrawal"}
          />
        );

      case "text":
      default:
        return (
          <span className="text-[#71727A] font-source-sans text-base font-normal leading-6 tracking-[-0.32px]">
            {value}
          </span>
        );
    }
  };

  // Determine what empty state to show
  const getEmptyStateType = () => {
    if (hasError) return "network_error";
    if (showSearch && searchQuery && filteredData.length === 0) return "no_results";
    if (isEmpty || data.length === 0) return "no_data";
    return "no_data";
  };

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-6 rounded-xl border border-[rgba(138,174,164,0.20)] bg-[rgba(242,244,247,0.50)] pb-5",
        className
      )}
    >
      {/* Table Header */}
      <div className="flex flex-col items-start gap-6 self-stretch pt-5 px-5">
        <h3 className="text-[#1F2024] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px]">
          {title}
        </h3>

        {/* Search, Sort, and Export Row - Only show if any option is enabled */}
        {(showSearch || showSort || showExport) && (
          <div className="flex items-center justify-between w-full gap-4">
            {/* Search Bar */}
            {showSearch && (
              <div className="flex items-center gap-3 h-10 max-w-[250px] px-3 flex-1 rounded-full border border-gray-300/20 bg-gray-100/50">
                <SearchIcon />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-gray-600 font-source-sans text-base placeholder:text-gray-500"
                  style={{ color: "#71727A" }}
                />
              </div>
            )}

            {/* Sort and Export Controls */}
            <div className="flex items-center gap-4">
              {/* Sort Filter */}
              {showSort && (
                <TimeSortFilter
                  value={sortValue}
                  onValueChange={setSortValue}
                />
              )}

              {/* Export Button */}
              {showExport && (
                <button
                  onClick={handleExport}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300/20 bg-gray-100/50 hover:bg-gray-200/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-[#1F3A3A)] font-source-sans text-base font-semibold">
                    Export Table
                  </span>
                  <ExportIcon />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Show empty state or table content */}
      {(filteredData.length === 0 && !isLoading) ? (
        <div className="w-full">
          <EmptyTableState
            type={getEmptyStateType()}
            onRetry={hasError ? onRetry : undefined}
            onClearFilters={showSearch && searchQuery ? handleClearSearch : undefined}
          />
        </div>
      ) : (
        <>
          {/* Column Headers */}
          <div className="flex flex-col justify-center items-center gap-2.5 self-stretch py-4 border-b border-[rgba(138,174,164,0.20)] bg-[rgba(242,244,247,0.80)]">
            <div className="flex items-center w-full px-5">
              {columns.map((column, index) => (
                <div
                  key={column.key}
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
                  <span className="text-[#20232A] font-space-grotesk text-base font-medium leading-6 tracking-[-0.32px]">
                    {column.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Table Body */}
          <div className="flex flex-col justify-center items-center gap-6 self-stretch px-5">
            {filteredData.map((row, rowIndex) => (
              <div 
                key={rowIndex} 
                className={cn(
                  "flex items-center w-full",
                  onRowClick && "cursor-pointer hover:bg-gray-50/50 rounded-lg transition-colors px-2 -mx-2 py-2"
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column, index) => (
                  <div
                    key={column.key}
                    className={cn(
                      "text-left",
                      index === 0
                        ? "flex-[0.8]"
                        : index === 1
                          ? "flex-[1.2]"
                          : index === columns.length - 1
                            ? "flex-[1] flex justify-center"
                            : "flex-1"
                    )}
                  >
                    {renderCell(column, row[column.key], row)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}