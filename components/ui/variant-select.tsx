"use client";
import React from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VariantSelectProps {
  placeholder?: string;
  options:
    | readonly { readonly value: string; readonly label: string }[]
    | { value: string; label: string }[];
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  variant?: "glass" | "ghost";
  icon?: string;
  iconAlt?: string;
}

export function VariantSelect({
  placeholder = "Select an option",
  options,
  value,
  onValueChange,
  className = "",
  variant = "glass",
  icon,
  iconAlt = "Icon",
}: VariantSelectProps) {
  const getVariantStyles = () => {
    if (variant === "ghost") {
      return {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "8px",
        background: "transparent",
        height: "auto",
        padding: "0",
        border: "none",
        boxShadow: "none",
      };
    }

    // Default glass variant
    return {
      display: "flex",
      padding: "6px 12px",
      justifyContent: "center",
      alignItems: "center",
      gap: "15px",
      borderRadius: "51px",
      border:
        "1px solid var(--Outline-on-System-Teal, rgba(138, 174, 164, 0.20))",
      background: "var(--secondary-background, rgba(242, 244, 247, 0.50))",
      backdropFilter: "blur(10px)",
    };
  };

  return (
    <div className={className}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          className="border-none bg-transparent p-0 h-auto"
          style={getVariantStyles()}
        >
          <div className="flex items-center gap-2">
            {icon && (
              <Image
                src={icon}
                alt={iconAlt}
                width={16}
                height={16}
                className="shrink-0"
              />
            )}
            <SelectValue placeholder={placeholder} />
          </div>
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
  );
}
