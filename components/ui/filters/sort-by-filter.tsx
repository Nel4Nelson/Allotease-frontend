"use client";
import { VariantSelect } from "@/components/ui/variant-select";

export const SORT_BY_OPTIONS = [
  { value: "createdAt", label: "Date Added" },
  { value: "price", label: "Price Range" },
] as const;

export const PRICE_RANGE_OPTIONS = [
  { value: "0-50000", label: "Under ₦50,000" },
  { value: "50000-100000", label: "₦50,000 - ₦100,000" },
  { value: "100000-200000", label: "₦100,000 - ₦200,000" },
  { value: "200000-500000", label: "₦200,000 - ₦500,000" },
  { value: "500000-1000000", label: "₦500,000 - ₦1,000,000" },
  { value: "1000000-999999999", label: "Above ₦1,000,000" },
] as const;

export type SortByValue = "createdAt" | "price";
export type PriceRangeValue = string; // Format: "minPrice-maxPrice"

interface SortByFilterProps {
  sortByValue: SortByValue;
  priceRangeValue?: PriceRangeValue;
  onSortByChange: (value: SortByValue) => void;
  onPriceRangeChange?: (value: PriceRangeValue) => void;
  className?: string;
}

export function SortByFilter({
  sortByValue,
  priceRangeValue,
  onSortByChange,
  onPriceRangeChange,
  className = "",
}: SortByFilterProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Sort By Selector */}
      <VariantSelect
        variant="glass"
        placeholder="Sort By"
        value={sortByValue}
        onValueChange={onSortByChange}
        options={SORT_BY_OPTIONS}
      />

      {/* Price Range Selector - Only show when sorting by price */}
      {sortByValue === "price" && onPriceRangeChange && (
        <VariantSelect
          variant="glass"
          placeholder="Select Range"
          value={priceRangeValue}
          onValueChange={onPriceRangeChange}
          options={PRICE_RANGE_OPTIONS}
        />
      )}
    </div>
  );
}