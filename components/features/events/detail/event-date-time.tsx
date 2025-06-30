"use client";
import React from "react";
import { EventDates } from "@/types/event-details";

interface EventDateTimeProps {
  dates: EventDates;
}

export function EventDateTime({ dates }: EventDateTimeProps) {
  const formatEventDate = (
    startDate: string,
    endDate: string,
    timezone: string
  ) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    const dateStr = start.toLocaleDateString("en-US", dateOptions);
    const startTimeStr = start.toLocaleTimeString("en-US", timeOptions);
    const endTimeStr = end.toLocaleTimeString("en-US", timeOptions);

    return `${dateStr} · ${startTimeStr} - ${endTimeStr} ${timezone}`;
  };

  return (
    <div className="py-6 border-b border-gray-200">
      <h3 className="text-[#1F2024] font-bold text-xl mb-3">Date & Time</h3>
      <div className="flex items-center gap-2 text-[#71727A]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 256 256"
          className="flex-shrink-0"
        >
          <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" />
        </svg>
        <span className="font-medium">
          {formatEventDate(dates.startDate, dates.endDate, dates.timezone)}
        </span>
      </div>
    </div>
  );
}
