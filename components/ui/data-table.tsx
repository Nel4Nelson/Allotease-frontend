/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { FallbackImage } from "@/components/ui/fallback-image";
import { cn } from "@/lib/utils";
import {
  CancelledIcon,
  ConfirmedIcon,
  PendingIcon,
  TicketIconGreen,
} from "../icons";

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
        case "cancelled":
          return {
            icon: <CancelledIcon />,
            bgColor: "#FFE2E7",
            textColor: "#EB4244",
            text: "Cancelled",
          };
        case "confirmed":
          return {
            icon: <ConfirmedIcon />,
            bgColor: "#ECFDF3",
            textColor: "#0A9355",
            text: "Confirmed",
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

    // Add other variants here (events, etc.)
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

// Column Configuration Types
export interface ColumnConfig {
  key: string;
  label: string;
  type: "text" | "guest" | "status" | "tickets" | "custom";
  render?: (value: any, row: any) => React.ReactNode;
}

export interface DataTableProps {
  title: string;
  columns: ColumnConfig[];
  data: any[];
  variant?: "reservations" | "events" | "withdrawal" | "generic";
  className?: string;
}

export function DataTable({
  title,
  columns,
  data,
  variant = "generic",
  className,
}: DataTableProps) {
  const renderCell = (column: ColumnConfig, value: any, row: any) => {
    if (column.render) {
      return column.render(value, row);
    }

    switch (column.type) {
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
      </div>

      {/* Column Headers */}
      <div className="flex flex-col justify-center items-center gap-2.5 self-stretch py-4 border-b border-[rgba(138,174,164,0.20)] bg-[rgba(242,244,247,0.80)]">
        <div className="flex items-center w-full px-5">
          {columns.map((column, index) => (
            <div
              key={column.key}
              className={cn(
                "text-left",
                index === 0
                  ? "flex-[0.8]" // First column - smaller
                  : index === 1
                  ? "flex-[1.2]" // Second column - wider (for guest column or wider content)
                  : index === columns.length - 1
                  ? "flex-[1] text-center" // Last column (Status) - center aligned
                  : "flex-1" // Middle columns - equal width
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
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center w-full">
            {columns.map((column, index) => (
              <div
                key={column.key}
                className={cn(
                  "text-left",
                  index === 0
                    ? "flex-[0.8]" // First column - smaller
                    : index === 1
                    ? "flex-[1.2]" // Second column - wider
                    : index === columns.length - 1
                    ? "flex-[1] flex justify-center" // Last column (Status) - center aligned, flex container
                    : "flex-1" // Middle columns - equal width
                )}
              >
                {renderCell(column, row[column.key], row)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
