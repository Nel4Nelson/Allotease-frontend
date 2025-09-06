"use client";
import { ContentHeader } from "@/components/ui/content-header";
import { SectionTitle } from "@/components/ui/section-title";
import { StayTypeFilter } from "./stay-type-filter";
import { LocationFilter } from "./location-filter";

interface StayFiltersProps {
  selectedLocation: string;
  selectedType: string;
  onLocationChange: (location: string) => void;
  onTypeChange: (type: string) => void;
  className?: string;
}

export function StayFilters({
  selectedLocation,
  selectedType,
  onLocationChange,
  onTypeChange,
  className = "",
}: StayFiltersProps) {
  return (
    <div className={className}>
      {/* Desktop */}
      <div className="hidden md:block">
        <ContentHeader
          title={<SectionTitle>Available accommodation near you</SectionTitle>}
          action={
            <StayTypeFilter value={selectedType} onValueChange={onTypeChange} />
          }
        />

        <LocationFilter
          value={selectedLocation}
          onValueChange={onLocationChange}
        />
      </div>

      {/* Mobile: Title and both selects in same row */}
      <div className="block md:hidden">
        <div className="mb-4">
          <SectionTitle>Available Stays near you</SectionTitle>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <LocationFilter
              value={selectedLocation}
              onValueChange={onLocationChange}
            />
          </div>

          <div className="flex-1">
            <StayTypeFilter value={selectedType} onValueChange={onTypeChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
