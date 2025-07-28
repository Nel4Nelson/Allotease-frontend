"use client";
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "../icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  label?: string;
  placeholder?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  error?: string;
  required?: boolean;
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export function DatePicker({
  label,
  placeholder = "Select date",
  value,
  onChange,
  error,
  required = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(
    value || new Date()
  );
  const [inputValue, setInputValue] = React.useState(formatDate(value));

  React.useEffect(() => {
    setInputValue(formatDate(value));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const date = new Date(newValue);
    if (isValidDate(date)) {
      onChange?.(date);
      setMonth(date);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    onChange?.(date);
    setInputValue(formatDate(date));
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
        <input
          value={inputValue}
          placeholder={placeholder}
          className="form-input pr-12 autocomplete-fix"
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
          aria-invalid={error ? "true" : "false"}
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <CalendarIcon width={20} height={21} />
              <span className="sr-only">Select date</span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={value}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleDateSelect}
            />
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
