"use client";
import { VariantSelect } from "@/components/ui/variant-select";
import { LOCATION_OPTIONS } from "@/lib/constants/locations";

interface LocationFilterProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function LocationFilter({
  value,
  onValueChange,
  className = "",
}: LocationFilterProps) {
  return (
    <VariantSelect
      variant="ghost"
      icon="/icons/location.svg"
      iconAlt="Location"
      value={value}
      onValueChange={onValueChange}
      options={LOCATION_OPTIONS}
      className={className}
    />
  );
}
