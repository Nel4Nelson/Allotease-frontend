"use client";
import { VariantSelect } from "@/components/ui/variant-select";

export const EVENT_TAGS_OPTIONS = [
  { value: "all", label: "All Tags" },
  { value: "Entertainment & Lifestyle", label: "Entertainment & Lifestyle" },
  { value: "Education & Learning", label: "Education & Learning" },
  { value: "Business & Networking", label: "Business & Networking" },
  { value: "Sports & Recreation", label: "Sports & Recreation" },
  { value: "Community & Culture", label: "Community & Culture" },
  { value: "Tech", label: "Tech" },
] as const;

interface EventTagsFilterProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function EventTagsFilter({
  value,
  onValueChange,
  className = "",
}: EventTagsFilterProps) {
  return (
    <VariantSelect
      variant="glass"
      placeholder="Tags"
      value={value}
      onValueChange={onValueChange}
      options={EVENT_TAGS_OPTIONS}
      className={className}
    />
  );
}