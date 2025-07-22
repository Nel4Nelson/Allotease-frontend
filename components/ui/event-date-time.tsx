import React from "react";
import { useEventFormStore } from "@/stores/event-form-store";
import { TicketIcon } from "../icons";

interface EventDateTimeProps {
  className?: string;
}

export function EventDateTime({ className = "" }: EventDateTimeProps) {
  const { formData } = useEventFormStore();

  // Format the date and time
  const formatDateTime = (): string => {
    const { eventDate, startTime, endTime } = formData;

    if (!eventDate || !startTime || !endTime) {
      return "Saturday, September 21 - 10am - 4pm WAT";
    }

    // Format the date
    const date = new Date(eventDate);
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-US", dateOptions);

    // Format start and end times
    const formatTime = (time: string): string => {
      if (!time) return "";

      // Parse time from HH:MM format
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours, 10);
      const minute = parseInt(minutes, 10);

      // Create Date object for time formatting
      const timeDate = new Date();
      timeDate.setHours(hour, minute);

      // Format to 12-hour format
      return timeDate
        .toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: minute > 0 ? "2-digit" : undefined,
          hour12: true,
        })
        .toLowerCase();
    };

    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);

    return `${formattedDate} - ${formattedStartTime} - ${formattedEndTime} WAT`;
  };

  const isPlaceholder =
    !formData.eventDate || !formData.startTime || !formData.endTime;

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
