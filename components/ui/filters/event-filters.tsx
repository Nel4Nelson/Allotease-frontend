"use client";
import { ContentHeader } from "@/components/ui/content-header";
import { SectionTitle } from "@/components/ui/section-title";
import { EventCategoryFilter } from "./event-category-filter";
import { LocationFilter } from "./location-filter";

interface EventFiltersProps {
  selectedLocation: string;
  selectedCategory: string;
  onLocationChange: (location: string) => void;
  onCategoryChange: (category: string) => void;
  className?: string;
}

export function EventFilters({
  selectedLocation,
  selectedCategory,
  onLocationChange,
  onCategoryChange,
  className = "",
}: EventFiltersProps) {
  return (
    <div className={className}>
      {/* Desktop: Category in header, Location below */}
      <div className="hidden md:block">
        <ContentHeader
          title={
            <SectionTitle>Available events in your location</SectionTitle>
          }
          action={
            <EventCategoryFilter
              value={selectedCategory}
              onValueChange={onCategoryChange}
            />
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
          <SectionTitle>Available events near you</SectionTitle>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <LocationFilter
              value={selectedLocation}
              onValueChange={onLocationChange}
            />
          </div>

          <div className="flex-1">
            <EventCategoryFilter
              value={selectedCategory}
              onValueChange={onCategoryChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
