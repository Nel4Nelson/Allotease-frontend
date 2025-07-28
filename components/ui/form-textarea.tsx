import React, { forwardRef, useId } from "react";
import { Label } from "@/components/ui/label";

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
  showLabel?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
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
    const textareaId = props.id || generatedId;

    return (
      <div className="space-y-1">
        {showLabel && label && (
          <Label htmlFor={textareaId} className="form-label">
            {label}
            {required && <span className="required ml-1">*</span>}
          </Label>
        )}

        {!showLabel && label && (
          <Label htmlFor={textareaId} className="sr-only">
            {label}
          </Label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            className={`form-input autocomplete-fix ${className}`}
            placeholder={props.placeholder}
            aria-invalid={error ? "true" : "false"}
            rows={6}
            style={{ minHeight: "141px", resize: "vertical" }}
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

FormTextarea.displayName = "FormTextarea";
