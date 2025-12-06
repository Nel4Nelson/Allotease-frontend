"use client";
import React from "react";

interface StayStatusFilterProps {
  selectedStatus: "all" | "active" | "expired";
  onStatusChange: (status: "all" | "active" | "expired") => void;
  className?: string;
}

export function StayStatusFilter({
  selectedStatus,
  onStatusChange,
  className = "",
}: StayStatusFilterProps) {
  const filters: Array<{ value: "all" | "active" | "expired"; label: string }> =
    [
      { value: "all", label: "All" },
      { value: "active", label: "Active" },
      { value: "expired", label: "Expired" },
    ];

  return (
    <div className={`flex gap-2 ${className}`}>
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onStatusChange(filter.value)}
          style={{
            display: "flex",
            padding: "6px 16px",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            borderRadius: "51px",
            border:
              selectedStatus === filter.value
                ? "1px solid var(--Orange-Red, #FF5B00)"
                : "1px solid rgba(138, 174, 164, 0.20)",
            background:
              selectedStatus === filter.value
                ? "rgba(255, 91, 0, 0.11)"
                : "transparent",
            color:
              selectedStatus === filter.value
                ? "#FF5B00"
                : "var(--Body, #71727A)",
            fontFamily: '"Source Sans Pro", sans-serif',
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "normal",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (selectedStatus !== filter.value) {
              e.currentTarget.style.background = "rgba(138, 174, 164, 0.10)";
            }
          }}
          onMouseLeave={(e) => {
            if (selectedStatus !== filter.value) {
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}