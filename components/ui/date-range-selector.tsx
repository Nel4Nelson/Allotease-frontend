"use client";
import React, { forwardRef, useId } from "react";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "@/components/icons";
import {
  DateRangePicker,
  DateInput,
  Group,
  DateSegment,
  RangeCalendar,
  CalendarGrid,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarGridBody,
  CalendarCell,
  Button,
  Heading,
  Popover,
  Dialog,
  type DateValue,
} from "react-aria-components";
import type { RangeValue } from "@react-types/shared";
import {
  CalendarDate,
  today,
  getLocalTimeZone,
} from "@internationalized/date";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangeSelectorProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  showLabel?: boolean;
  className?: string;
}

export const DateRangeSelector = forwardRef<HTMLDivElement, DateRangeSelectorProps>(
  (
    {
      value,
      onChange,
      label,
      error,
      required = false,
      showLabel = false,
      className = "",
    },
    ref
  ) => {
    const generatedId = useId();

    const ariaValue: RangeValue<DateValue> | null = 
      value.from && value.to 
        ? {
            start: new CalendarDate(
              value.from.getFullYear(),
              value.from.getMonth() + 1,
              value.from.getDate()
            ),
            end: new CalendarDate(
              value.to.getFullYear(),
              value.to.getMonth() + 1,
              value.to.getDate()
            ),
          }
        : null;

    // Handle React Aria's onChange format
    const handleAriaChange = (range: RangeValue<DateValue> | null) => {
      if (range) {
        onChange({
          from: new Date(range.start.year, range.start.month - 1, range.start.day),
          to: new Date(range.end.year, range.end.month - 1, range.end.day),
        });
      } else {
        onChange({ from: undefined, to: undefined });
      }
    };

    return (
      <div className="space-y-1" ref={ref}>
        {showLabel && label && (
          <Label htmlFor={generatedId} className="form-label">
            {label}
            {required && <span className="required ml-1">*</span>}
          </Label>
        )}

        {!showLabel && label && (
          <Label htmlFor={generatedId} className="sr-only">
            {label}
          </Label>
        )}

        <DateRangePicker
          value={ariaValue}
          onChange={handleAriaChange}
          className={`relative  ${className}`}
          aria-invalid={error ? "true" : "false"}
          placeholderValue={today(getLocalTimeZone())}
          isRequired={required}
          minValue={today(getLocalTimeZone())}
        >
          <Group className="form-input lg:!p-1 flex items-center justify-between cursor-pointer min-h-[44px] py-2">
            <div className="flex items-center">
              <DateInput slot="start" className="flex items-center">
                {(segment) => (
                  <DateSegment
                    segment={segment}
                    className="lg:px-[1px] px-0.5 py-0.5 text-sm text-gray-900 outline-none focus:bg-orange-100 focus:text-orange-900 rounded"
                  />
                )}
              </DateInput>
              <span className="text-gray-400 p-1" aria-hidden="true">–</span>
              <DateInput slot="end" className="flex items-center">
                {(segment) => (
                  <DateSegment
                    segment={segment}
                    className="lg:px-[1px] px-0.5 py-0.5 text-sm text-gray-900 outline-none focus:bg-orange-100 focus:text-orange-900 rounded"
                  />
                )}
              </DateInput>
            </div>
            <Button className=" hover:bg-gray-100 rounded transition-colors outline-none focus:ring-2 focus:ring-orange-500">
              <CalendarIcon
              width={17}
              height={17}
              className="text-gray-500 flex-shrink-0"
            />
            </Button>
          </Group>

          <Popover className="bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-[300px] max-w-[400px]">
            <Dialog className="outline-none">
              <RangeCalendar className="w-full">
                <header className="flex items-center justify-between mb-4 px-1">
                  <Button
                    slot="previous"
                    className="p-2 hover:bg-gray-100 rounded transition-colors outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Button>

                  <Heading className="text-lg font-semibold text-gray-900" />

                  <Button
                    slot="next"
                    className="p-2 hover:bg-gray-100 rounded transition-colors outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </header>

                <CalendarGrid className="w-full border-collapse">
                  <CalendarGridHeader>
                    {(day) => (
                      <CalendarHeaderCell className="text-center text-xs font-medium text-gray-500 py-2 w-10">
                        {day}
                      </CalendarHeaderCell>
                    )}
                  </CalendarGridHeader>
                  <CalendarGridBody>
                    {(date) => (
                      <CalendarCell
                        date={date}
                        className={({ 
                          isSelected, 
                          isFocused, 
                          isOutsideMonth, 
                          isDisabled,
                          isSelectionStart,
                          isSelectionEnd
                        }) => {
                          const baseClasses = "w-10 h-10 text-sm flex items-center justify-center transition-all duration-200 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer relative";
                          
                          if (isOutsideMonth) {
                            return `${baseClasses} text-gray-300`;
                          }
                          
                          if (isDisabled) {
                            return `${baseClasses} text-gray-300 cursor-not-allowed`;
                          }
                      
                          if (isSelectionStart || isSelectionEnd) {
                            return `${baseClasses} text-white font-medium relative before:absolute before:inset-0 before:rounded-full before:bg-[#ff5b00] before:-z-10`;
                          }
                          
                          if (isSelected) {
                            return `${baseClasses} text-white font-medium relative before:absolute before:inset-0 before:rounded-full before:bg-[#ff5b00] before:-z-10`;
                          }
                          
                          if (isFocused) {
                            return `${baseClasses} bg-gray-100 text-gray-900 rounded-full`;
                          }
                          
                          return `${baseClasses} text-gray-900 hover:bg-gray-100 hover:rounded-full`;
                        }}
                      />
                    )}
                  </CalendarGridBody>
                </CalendarGrid>
              </RangeCalendar>
            </Dialog>
          </Popover>
        </DateRangePicker>

        {error && (
          <p className="text-red-500 text-sm font-source-sans-pro" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

DateRangeSelector.displayName = "DateRangeSelector";