import React, { forwardRef } from "react";
import { Label } from "@/components/ui/label";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  showLabel?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, required = false, showLabel = false, className = "", ...props }, ref) => {
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

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
            className={`form-input ${className}`}
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