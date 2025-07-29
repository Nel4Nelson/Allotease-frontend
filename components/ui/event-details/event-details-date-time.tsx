import { TicketIcon } from "@/components/icons";
import React from "react";

interface EventDetailsDateTimeProps {
  startTime: string; // ISO date string from API
  endTime?: string; // ISO date string from API (optional)
  className?: string;
}

export function EventDetailsDateTime({
  startTime,
  endTime,
  className = "",
}: EventDetailsDateTimeProps) {
  // Format the date and time
  const formatDateTime = (): string => {
    if (!startTime) {
      return "Saturday, September 21 - 10am - 4pm WAT";
    }

    try {
      // Parse the ISO date strings
      const startDate = new Date(startTime);
      const endDate = endTime ? new Date(endTime) : null;

      // Format the date
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: "long",
        month: "long",
        day: "numeric",
      };
      const formattedDate = startDate.toLocaleDateString("en-US", dateOptions);

      // Format start time
      const formattedStartTime = startDate
        .toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: startDate.getMinutes() > 0 ? "2-digit" : undefined,
          hour12: true,
        })
        .toLowerCase();

      // Format end time if available
      let timeRange = formattedStartTime;
      if (endDate) {
        const formattedEndTime = endDate
          .toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: endDate.getMinutes() > 0 ? "2-digit" : undefined,
            hour12: true,
          })
          .toLowerCase();
        timeRange = `${formattedStartTime} - ${formattedEndTime}`;
      }

      return `${formattedDate} - ${timeRange} WAT`;
    } catch (error) {
      console.error("Error formatting date time:", error);
      return "Saturday, September 21 - 10am - 4pm WAT";
    }
  };

  const isPlaceholder = !startTime;

  return (
    <div className={className}>
      {/* Section Title */}
      <h3 className="text-[var(--Title,#1F2024)] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px] mb-4">
        Date & Time
      </h3>

      {/* Date & Time Info */}
      <div className="flex items-center gap-3">
        <TicketIcon />
        <span
          className={`
            text-[var(--Body,#71727A)] 
            font-source-sans-pro 
            text-base 
            font-semibold 
            leading-[142.745%] 
            tracking-[-0.32px]
            ${isPlaceholder ? "text-gray-400" : ""}
          `}
        >
          {formatDateTime()}
        </span>
      </div>
    </div>
  );
}
