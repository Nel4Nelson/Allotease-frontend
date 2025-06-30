// /components/ui/form-file-upload.tsx
import React, { useState, useRef } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FormFileUploadProps {
  label?: string;
  error?: string;
  required?: boolean;
  showLabel?: boolean;
  accept?: string;
  onChange?: (file: File | null) => void;
  value?: File | null;
  placeholder?: string;
  className?: string;
}

export const FormFileUpload: React.FC<FormFileUploadProps> = ({
  label,
  error,
  required = false,
  showLabel = false,
  accept = "image/*",
  onChange,
  value,
  placeholder = "Upload image",
  className = "",
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadId = `upload-${Math.random().toString(36).substr(2, 9)}`;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file) {
      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }

    onChange?.(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-1">
      {showLabel && label && (
        <Label htmlFor={uploadId} className="form-label">
          {label}
          {required && <span className="required ml-1">*</span>}
        </Label>
      )}

      {!showLabel && label && (
        <Label htmlFor={uploadId} className="sr-only">
          {label}
        </Label>
      )}

      <div className={`space-y-3 ${className}`}>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          id={uploadId}
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          aria-invalid={error ? "true" : "false"}
        />

        {/* Upload button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          className="w-full justify-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          {placeholder}
        </Button>

        {/* Preview */}
        {preview && (
          <div className="relative">
            {/* Using Next.js Image component for optimization */}
            <div className="relative w-full h-48 rounded-lg border border-[var(--input-border)] overflow-hidden">
              <Image
                src={preview}
                alt="Upload preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* File info */}
        {value && (
          <div className="text-sm text-[var(--body-text)] font-source-sans-pro">
            Selected: {value.name} ({(value.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm font-source-sans-pro" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

FormFileUpload.displayName = "FormFileUpload";
