import React, { forwardRef, useId } from "react";
import { Label } from "@/components/ui/label";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  showLabel?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      required = false,
      showLabel = false,
      className = "",
      ...props
    },
    ref
  ) => {
  
    const generatedId = useId();
    const inputId = props.id || generatedId;

    return (
      <div className="space-y-1">
        {showLabel && label && (
          <Label htmlFor={inputId} className="form-label">
            {label}
            {required && <span className="required ml-1">*</span>}
          </Label>
        )}

        {!showLabel && label && (
          <Label htmlFor={inputId} className="sr-only">
            {label}
          </Label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={`form-input autocomplete-fix ${className}`}
            placeholder={props.placeholder}
            aria-invalid={error ? "true" : "false"}
            {...props}
          />
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

FormInput.displayName = "FormInput";