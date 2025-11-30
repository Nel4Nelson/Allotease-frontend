"use client";
import { VariantSelect } from "@/components/ui/variant-select";

export const EVENT_TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "physical", label: "Physical" },
  { value: "remote", label: "Remote" },
] as const;

interface EventTypeFilterProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function EventTypeFilter({
  value,
  onValueChange,
  className = "",
}: EventTypeFilterProps) {
  return (
    <VariantSelect
      variant="glass"
      placeholder="Event Type"
      value={value}
      onValueChange={onValueChange}
      options={EVENT_TYPE_OPTIONS}
      className={className}
    />
  );
}