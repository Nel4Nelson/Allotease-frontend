"use client";
import { VariantSelect } from "@/components/ui/variant-select";

export const SORT_ORDER_OPTIONS = [
  { value: "desc", label: "Newest First" },
  { value: "asc", label: "Oldest First" },
] as const;

interface SortOrderFilterProps {
  value: "asc" | "desc";
  onValueChange: (value: "asc" | "desc") => void;
  className?: string;
}

export function SortOrderFilter({
  value,
  onValueChange,
  className = "",
}: SortOrderFilterProps) {
  return (
    <VariantSelect
      variant="glass"
      placeholder="Sort"
      value={value}
      onValueChange={onValueChange}
      options={SORT_ORDER_OPTIONS}
      className={className}
    />
  );
}