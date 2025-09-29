import React, { forwardRef, useId, useState } from "react";
import { Label } from "@/components/ui/label";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  showLabel?: boolean;
}

// Todo: Make this icon reusable to be able to accept color
export const EyeOpenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
  >
    <path
      d="M10 4.875C3.75 4.875 1.25 10.5 1.25 10.5C1.25 10.5 3.75 16.125 10 16.125C16.25 16.125 18.75 10.5 18.75 10.5C18.75 10.5 16.25 4.875 10 4.875Z"
      stroke="#1F2024"
      strokeOpacity="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 13.625C11.7259 13.625 13.125 12.2259 13.125 10.5C13.125 8.77411 11.7259 7.375 10 7.375C8.27411 7.375 6.875 8.77411 6.875 10.5C6.875 12.2259 8.27411 13.625 10 13.625Z"
      stroke="#1F2024"
      strokeOpacity="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Eye Icon (Closed) - Modified from open version
export const EyeClosedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
  >
    <path
      d="M3.28 3.78l13.44 13.44"
      stroke="#1F2024"
      strokeOpacity="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 4.875C3.75 4.875 1.25 10.5 1.25 10.5C1.25 10.5 3.75 16.125 10 16.125C16.25 16.125 18.75 10.5 18.75 10.5C18.75 10.5 16.25 4.875 10 4.875Z"
      stroke="#1F2024"
      strokeOpacity="0.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 13.625C11.7259 13.625 13.125 12.2259 13.125 10.5C13.125 8.77411 11.7259 7.375 10 7.375C8.27411 7.375 6.875 8.77411 6.875 10.5C6.875 12.2259 8.27411 13.625 10 13.625Z"
      stroke="#1F2024"
      strokeOpacity="0.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      required = false,
      showLabel = false,
      className = "",
      type,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const inputId = props.id || generatedId;

    // Determine if this is a password field
    const isPasswordField = type === "password";

    // Use the actual input type (toggle between password and text for password fields)
    const inputType = isPasswordField
      ? showPassword
        ? "text"
        : "password"
      : type;

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

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
            type={inputType}
            className={`form-input autocomplete-fix ${isPasswordField ? "pr-12" : ""
              } ${className}`}
            placeholder={props.placeholder}
            aria-invalid={error ? "true" : "false"}
            {...props}
          />

          {/* Password visibility toggle button */}
          {isPasswordField && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--feature-accent-orange)]/30 focus:ring-offset-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </button>
          )}
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
