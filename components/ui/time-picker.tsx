"use client";
import * as React from "react";
import { TimeField, DateInput, DateSegment } from "react-aria-components";
import { Time } from "@internationalized/date";

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
  value = "",
  onChange,
  error,
  required = false,
}: TimePickerProps) {
  // Convert string value to Time object
  const timeValue = React.useMemo(() => {
    if (!value) return null;
    const [hours, minutes] = value.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    return new Time(hours, minutes);
  }, [value]);

  // Handle time change
  const handleTimeChange = React.useCallback(
    (time: Time | null) => {
      if (!time) {
        onChange?.("");
        return;
      }

      // Convert Time object back to HH:MM string format
      const hours = time.hour.toString().padStart(2, "0");
      const minutes = time.minute.toString().padStart(2, "0");
      const timeString = `${hours}:${minutes}`;
      onChange?.(timeString);
    },
    [onChange]
  );

  return (
    <div className="space-y-1 flex-1">
      {label && (
        <label className="sr-only">
          {label}
          {required && <span className="ml-1">*</span>}
        </label>
      )}

      <TimeField
        value={timeValue}
        onChange={handleTimeChange}
        isRequired={required}
        validationBehavior="aria"
        className="relative"
      >
        <DateInput className="form-input flex items-center justify-start w-full">
          {(segment) => (
            <DateSegment
              segment={segment}
              className={`px-0.5 tabular-nums outline-none rounded-sm focus:bg-blue-100 focus:text-blue-900 placeholder-shown:text-[var(--input-placeholder)] ${
                segment.isPlaceholder
                  ? "text-[var(--input-placeholder)]"
                  : "text-[var(--input-text)]"
              }`}
            />
          )}
        </DateInput>
      </TimeField>

      {error && (
        <p className="text-red-500 text-sm font-source-sans-pro" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
