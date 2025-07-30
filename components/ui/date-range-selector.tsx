"use client";
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@/components/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DateRange as ReactDayPickerDateRange } from "react-day-picker";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangeSelectorProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  className?: string;
}

function formatDateRange(range: DateRange | undefined) {
  if (!range?.from) {
    return "";
  }

  if (!range.to) {
    return range.from.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }

  const fromStr = range.from.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const toStr = range.to.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  return `${fromStr} - ${toStr}`;
}

export function DateRangeSelector({
  value,
  onChange,
  placeholder = "Select date range",
  className = "",
}: DateRangeSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(
    value?.from || new Date()
  );

  const handleDateSelect = (range: ReactDayPickerDateRange | undefined) => {
    if (range) {
      const normalizedRange: DateRange = {
        from: range.from,
        to: range.to,
      };

      onChange?.(normalizedRange);

      // Close popover when both dates are selected
      if (normalizedRange.from && normalizedRange.to) {
        setOpen(false);
      }
    }
  };

  const displayText = formatDateRange(value);

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-3 w-full p-3 text-left border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            style={{
              background: "rgba(242, 244, 247, 0.50)",
              minHeight: "48px",
            }}
          >
            <CalendarIcon
              width={20}
              height={21}
              className="text-gray-500 flex-shrink-0"
            />
            <span
              className={`text-sm flex-1 ${
                displayText ? "text-gray-900" : "text-gray-500"
              }`}
              style={{
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "14px",
                fontWeight: 400,
              }}
            >
              {displayText || placeholder}
            </span>
            <svg
              className="w-4 h-4 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="start"
          sideOffset={10}
        >
          <Calendar
            mode="range"
            selected={value}
            onSelect={handleDateSelect}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            numberOfMonths={2}
            disabled={(date) => date < new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
