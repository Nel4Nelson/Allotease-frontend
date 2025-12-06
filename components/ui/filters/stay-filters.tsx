"use client";
import { ContentHeader } from "@/components/ui/content-header";
import { SectionTitle } from "@/components/ui/section-title";
import { StayTypeFilter } from "./stay-type-filter";
import { LocationSearch } from "../location-search";
import { SortOrderFilter } from "./sort-order-filter";


interface LocationCoordinates {
  lat: number;
  lng: number;
}

interface StayFiltersProps {
  selectedLocation: LocationCoordinates | null;
  selectedType: string;
  selectedSortOrder: "asc" | "desc";
  onLocationChange: (coordinates: LocationCoordinates, placeName: string) => void;
  onTypeChange: (type: string) => void;
  onSortOrderChange: (sortOrder: "asc" | "desc") => void;
  className?: string;
}

export function StayFilters({
  selectedType,
  selectedSortOrder,
  onLocationChange,
  onTypeChange,
  onSortOrderChange,
  className = "",
}: StayFiltersProps) {
  return (
    <div className={className}>
      {/* Desktop */}
      <div className="hidden md:block space-y-4">
        <ContentHeader
          title={<SectionTitle>Available space near you</SectionTitle>}
          action={
            <div className="flex items-center gap-3">
              <SortOrderFilter
                value={selectedSortOrder}
                onValueChange={onSortOrderChange}
              />
              <StayTypeFilter value={selectedType} onValueChange={onTypeChange} />
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
          <SectionTitle>Available space near you</SectionTitle>
        </div>

        <LocationSearch
          onLocationSelect={onLocationChange}
          placeholder="Search location..."
        />

        <div className="flex items-center gap-3">
          <div className="">
            <StayTypeFilter value={selectedType} onValueChange={onTypeChange} />
          </div>

          <div className="">
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