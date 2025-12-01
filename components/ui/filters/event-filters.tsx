"use client";
import { ContentHeader } from "@/components/ui/content-header";
import { SectionTitle } from "@/components/ui/section-title";
import { EventTagsFilter } from "./event-tags-filter";
import { EventTypeFilter } from "./event-type-filter";
import { SortOrderFilter } from "./sort-order-filter";
import { LocationSearch } from "../location-search";

interface LocationCoordinates {
  lat: number;
  lng: number;
}

interface EventFiltersProps {
  selectedLocation: LocationCoordinates | null;
  selectedTags: string;
  selectedEventType: string;
  selectedSortOrder: "asc" | "desc";
  onLocationChange: (coordinates: LocationCoordinates, placeName: string) => void;
  onTagsChange: (tags: string) => void;
  onEventTypeChange: (eventType: string) => void;
  onSortOrderChange: (sortOrder: "asc" | "desc") => void;
  className?: string;
}

export function EventFilters({
  selectedTags,
  selectedEventType,
  selectedSortOrder,
  onLocationChange,
  onTagsChange,
  onEventTypeChange,
  onSortOrderChange,
  className = "",
}: EventFiltersProps) {
  return (
    <div className={className}>
      {/* Desktop */}
      <div className="hidden md:block space-y-4">
        <ContentHeader
          title={<SectionTitle>Available events in your location</SectionTitle>}
          action={
            <div className="flex items-center gap-3">
              <SortOrderFilter
                value={selectedSortOrder}
                onValueChange={onSortOrderChange}
              />
              <EventTypeFilter
                value={selectedEventType}
                onValueChange={onEventTypeChange}
              />
              <EventTagsFilter
                value={selectedTags}
                onValueChange={onTagsChange}
              />
            </div>
          }
        />

        <LocationSearch
          onLocationSelect={onLocationChange}
          placeholder="Search location or city..."
        />
      </div>

      {/* Mobile */}
      <div className="block md:hidden space-y-4">
        <div className="mb-4">
          <SectionTitle>Available events near you</SectionTitle>
        </div>

        <LocationSearch
          onLocationSelect={onLocationChange}
          placeholder="Search location..."
        />

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <EventTypeFilter
              value={selectedEventType}
              onValueChange={onEventTypeChange}
            />
          </div>

          <div className="flex-1">
            <EventTagsFilter
              value={selectedTags}
              onValueChange={onTagsChange}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <SortOrderFilter
              value={selectedSortOrder}
              onValueChange={onSortOrderChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}