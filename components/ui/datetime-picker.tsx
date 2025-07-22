"use client";
import * as React from "react";
import { DatePicker } from "./date-picker";
import { TimePicker } from "./time-picker";

interface DateTimePickerProps {
  dateLabel?: string;
  startTimeLabel?: string;
  endTimeLabel?: string;
  datePlaceholder?: string;
  startTimePlaceholder?: string;
  endTimePlaceholder?: string;
  date?: Date;
  startTime?: string;
  endTime?: string;
  onDateChange?: (date: Date | undefined) => void;
  onStartTimeChange?: (time: string) => void;
  onEndTimeChange?: (time: string) => void;
  dateError?: string;
  startTimeError?: string;
  endTimeError?: string;
  required?: boolean;
}

export function DateTimePicker({
  dateLabel = "Date",
  startTimeLabel = "Start time",
  endTimeLabel = "End time",
  datePlaceholder = "Date*",
  startTimePlaceholder = "Start time*",
  endTimePlaceholder = "End time*",
  date,
  startTime,
  endTime,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  dateError,
  startTimeError,
  endTimeError,
  required = false,
}: DateTimePickerProps) {
  return (
    <div className="space-y-4">
      {/* Date and Time Row */}
      <div className="flex gap-4">
        {/* Date Picker - Takes half width */}
        <div className="flex-1">
          <DatePicker
            label={dateLabel}
            placeholder={datePlaceholder}
            value={date}
            onChange={onDateChange}
            error={dateError}
            required={required}
          />
        </div>

        {/* Time Pickers - Share the other half */}
        <div className="flex-1 flex gap-4">
          <TimePicker
            label={startTimeLabel}
            placeholder={startTimePlaceholder}
            value={startTime}
            onChange={onStartTimeChange}
            error={startTimeError}
            required={required}
          />
          <TimePicker
            label={endTimeLabel}
            placeholder={endTimePlaceholder}
            value={endTime}
            onChange={onEndTimeChange}
            error={endTimeError}
            required={required}
          />
        </div>
      </div>

      {/* Error Messages Row */}
      {(dateError || startTimeError || endTimeError) && (
        <div className="flex gap-4">
          <div className="flex-1">{/* Date error space */}</div>
          <div className="flex-1 flex gap-4">{/* Time errors space */}</div>
        </div>
      )}
    </div>
  );
}
