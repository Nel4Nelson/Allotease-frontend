"use client";
import { VariantSelect } from "@/components/ui/variant-select";

export const TIME_SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "recently-updated", label: "Recently Updated" },
  { value: "alphabetical", label: "Alphabetical" },
] as const;

interface TimeSortFilterProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function TimeSortFilter({
  value,
  onValueChange,
  className = "",
}: TimeSortFilterProps) {
  return (
    <VariantSelect
      variant="glass"
      placeholder="Sort By: Time"
      value={value}
      onValueChange={onValueChange}
      options={TIME_SORT_OPTIONS}
      className={className}
    />
  );
}
