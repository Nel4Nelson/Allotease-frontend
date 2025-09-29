"use client";
import React, { forwardRef, useId } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormSelectProps {
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  showLabel?: boolean;
  className?: string;
  id?: string;
  disabled?: boolean;
}

export const FormSelect = forwardRef<HTMLDivElement, FormSelectProps>(
  (
    {
      label,
      placeholder = "Select an option",
      options,
      value,
      onValueChange,
      error,
      required = false,
      showLabel = false,
      className = "",
      id,
      disabled = false,
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className="space-y-1" ref={ref}>
        {showLabel && label && (
          <Label htmlFor={selectId} className="form-label">
            {label}
            {required && <span className="required ml-1">*</span>}
          </Label>
        )}

        {!showLabel && label && (
          <Label htmlFor={selectId} className="sr-only">
            {label}
          </Label>
        )}

        <div className="relative">
          <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger 
              id={selectId}
              className={`form-input autocomplete-fix ${className}`}
              style={{
                border: error ? '1px solid #ef4444' : undefined,
              }}
              disabled={disabled}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && (
          <p className="text-red-500 text-sm font-source-sans-pro" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";