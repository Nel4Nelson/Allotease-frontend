"use client";
import { VariantSelect } from "@/components/ui/variant-select";

export const EVENT_CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "workshop", label: "Workshop" },
  { value: "conference", label: "Conference" },
  { value: "seminar", label: "Seminar" },
  { value: "networking", label: "Networking" },
  { value: "Bitcoin", label: "Bitcoin" },
  { value: "Pool", label: "Pool Party" },
  { value: "Ethereum", label: "Ethereum" },
] as const;

interface EventCategoryFilterProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function EventCategoryFilter({
  value,
  onValueChange,
  className = "",
}: EventCategoryFilterProps) {
  return (
    <VariantSelect
      variant="glass"
      placeholder="Category"
      value={value}
      onValueChange={onValueChange}
      options={EVENT_CATEGORY_OPTIONS}
      className={className}
    />
  );
}