"use client";
import { VariantSelect } from "@/components/ui/variant-select";

export const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
] as const;

// Extract the union type from STATUS_OPTIONS
export type StatusValue = (typeof STATUS_OPTIONS)[number]["value"];

interface StatusFilterProps {
  value: StatusValue;
  onValueChange: (value: StatusValue) => void;
  className?: string;
}

export function StatusFilter({
  value,
  onValueChange,
  className = "",
}: StatusFilterProps) {
  return (
    <VariantSelect
      variant="glass"
      placeholder="Status"
      value={value}
      onValueChange={onValueChange}
      options={STATUS_OPTIONS}
      className={className}
    />
  );
}