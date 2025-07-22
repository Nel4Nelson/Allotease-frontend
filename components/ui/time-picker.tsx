"use client";
import * as React from "react";
import { ChevronDownIcon } from "../icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TimePickerProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (time: string) => void;
  error?: string;
  required?: boolean;
}

export function TimePicker({
  label,
  placeholder = "Select time",
  value = "",
  onChange,
  error,
  required = false,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Generate time options (every 30 minutes)
  const timeOptions = React.useMemo(() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeValue = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const displayTime = new Date(
          `2000-01-01T${timeValue}`
        ).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        options.push({ value: timeValue, display: displayTime });
      }
    }
    return options;
  }, []);

  const displayValue = React.useMemo(() => {
    if (!value) return "";
    const option = timeOptions.find((opt) => opt.value === value);
    return option ? option.display : value;
  }, [value, timeOptions]);

  const handleTimeSelect = (timeValue: string) => {
    onChange?.(timeValue);
    setOpen(false);
  };

  return (
    <div className="space-y-1 flex-1">
      {label && (
        <label className="sr-only">
          {label}
          {required && <span className="ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="form-input text-left justify-between items-center flex pr-12 w-full"
            >
              <span
                className={
                  value
                    ? "text-[var(--input-text)]"
                    : "text-[var(--input-placeholder)]"
                }
              >
                {displayValue || placeholder}
              </span>
              <ChevronDownIcon
                width={18}
                height={18}
                className="absolute right-1"
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-48 p-2 max-h-60 overflow-y-auto"
            align="start"
            sideOffset={8}
          >
            <div className="grid gap-1">
              {timeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors ${
                    value === option.value ? "bg-blue-100 text-blue-900" : ""
                  }`}
                  onClick={() => handleTimeSelect(option.value)}
                >
                  {option.display}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {error && (
        <p className="text-red-500 text-sm font-source-sans-pro" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
