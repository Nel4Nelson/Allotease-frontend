"use client";
import { VariantSelect } from "@/components/ui/variant-select";

export const STAY_TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "apartment", label: "Apartment" },
  { value: "shared apartment", label: "Shared Apartment" },
  { value: "house", label: "House" },
  { value: "student hostel", label: "Student Hostel" },
  { value: "hotel room", label: "Hotel Room" },
  { value: "guest house", label: "Guest House" },
  { value: "shortlet / serviced apartment", label: "Shortlet / Serviced Apartment" },
  { value: "co-working space", label: "Co-working Space" },
  { value: "event hall / meeting space", label: "Event Hall / Meeting Space" },
  { value: "shop / retail space", label: "Shop / Retail Space" },
  { value: "others", label: "Others" },
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