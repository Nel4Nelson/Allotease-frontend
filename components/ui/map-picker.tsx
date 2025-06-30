// /components/ui/map-picker.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { EventLocation } from "@/types/events";

interface MapPickerProps {
  label?: string;
  error?: string;
  required?: boolean;
  showLabel?: boolean;
  value?: EventLocation;
  onChange?: (location: EventLocation) => void;
  placeholder?: string;
}

// Simple map component - In production, you'd use actual Mapbox
const SimpleMap: React.FC<{
  location?: EventLocation;
  onLocationSelect?: (location: EventLocation) => void;
  expanded?: boolean;
}> = ({ location, onLocationSelect, expanded = false }) => {
  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Simulate map click to select location
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Mock coordinates (in production, convert pixel to lat/lng)
    // Using x and y to create variation in the mock coordinates
    const mockLocation: EventLocation = {
      address: "Selected Location",
      latitude: 6.5244 + (x / rect.width - 0.5) * 0.1,
      longitude: 3.3792 + (y / rect.height - 0.5) * 0.1,
      placeName: "Custom Location",
    };

    onLocationSelect?.(mockLocation);
  };

  return (
    <div
      className={`relative bg-gray-100 border border-[var(--input-border)] rounded-lg overflow-hidden cursor-pointer ${
        expanded ? "h-96" : "h-48"
      }`}
      onClick={handleMapClick}
    >
      {/* Mock map background */}
      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative">
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern
                id="grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="#ccc"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Location marker */}
        {location && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 bg-[var(--feature-accent-orange)] rounded-full border-2 border-white shadow-lg"></div>
          </div>
        )}

        {/* Click instruction */}
        {!location && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg
                className="w-8 h-8 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-sm font-source-sans-pro">
                Click to select location
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const MapPicker: React.FC<MapPickerProps> = ({
  label,
  error,
  required = false,
  showLabel = false,
  value,
  onChange,
  placeholder = "Find location",
}) => {
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState<EventLocation | undefined>(value);
  const pickerId = `map-picker-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    setLocation(value);
  }, [value]);

  const handleLocationSelect = (newLocation: EventLocation) => {
    setLocation(newLocation);
    setSearchQuery(newLocation.address);
    onChange?.(newLocation);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      // Mock geocoding - in production, use Mapbox Geocoding API
      const mockLocation: EventLocation = {
        address: searchQuery,
        latitude: 6.5244,
        longitude: 3.3792,
        placeName: searchQuery,
      };
      handleLocationSelect(mockLocation);
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="space-y-1">
      {showLabel && label && (
        <Label htmlFor={pickerId} className="form-label">
          {label}
          {required && <span className="required ml-1">*</span>}
        </Label>
      )}

      {!showLabel && label && (
        <Label htmlFor={pickerId} className="sr-only">
          {label}
        </Label>
      )}

      <div className="space-y-3">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit}>
          <FormInput
            id={pickerId}
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className="pr-10"
          />
        </form>

        {/* Map Container */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-source-sans-pro text-[var(--body-text)]">
              {location ? location.address : "No location selected"}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              className="text-[var(--feature-accent-orange)]"
            >
              {expanded ? "Collapse" : "Expand"}
            </Button>
          </div>

          <SimpleMap
            location={location}
            onLocationSelect={handleLocationSelect}
            expanded={expanded}
          />
        </div>

        {/* Location Details */}
        {location && (
          <div className="text-sm text-[var(--body-text)] font-source-sans-pro space-y-1">
            <p>
              <strong>Address:</strong> {location.address}
            </p>
            {location.placeName && (
              <p>
                <strong>Place:</strong> {location.placeName}
              </p>
            )}
            {location.latitude && location.longitude && (
              <p>
                <strong>Coordinates:</strong> {location.latitude.toFixed(6)},{" "}
                {location.longitude.toFixed(6)}
              </p>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm font-source-sans-pro" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Note: This is a simplified implementation. For production, you would:
// 1. Install mapbox-gl and @mapbox/mapbox-gl-geocoder
// 2. Set up proper Mapbox API key
// 3. Use actual Mapbox components for map rendering and geocoding
// 4. Handle proper coordinate transformations
// 5. Add more interactive features like zoom, pan, etc.
