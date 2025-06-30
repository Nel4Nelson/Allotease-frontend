// /components/ui/form-select.tsx
import React, { forwardRef } from "react";
import { Label } from "@/components/ui/label";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  showLabel?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      error,
      required = false,
      showLabel = false,
      className = "",
      options,
      placeholder,
      ...props
    },
    ref
  ) => {
    const selectId =
      props.id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-1">
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
          <select
            ref={ref}
            id={selectId}
            className={`form-input ${className}`}
            aria-invalid={error ? "true" : "false"}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
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
