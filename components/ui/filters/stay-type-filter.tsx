"use client";
import { VariantSelect } from "@/components/ui/variant-select";

export const STAY_TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "hotel & lodging", label: "Hotels & Lodging" },
  { value: "appartments", label: "Apartments" },
  { value: "hostels", label: "Hostels" },
] as const;

interface StayTypeFilterProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function StayTypeFilter({
  value,
  onValueChange,
  className = "",
}: StayTypeFilterProps) {
  return (
    <VariantSelect
      variant="glass"
      placeholder="Type"
      value={value}
      onValueChange={onValueChange}
      options={STAY_TYPE_OPTIONS}
      className={className}
    />
  );
}
