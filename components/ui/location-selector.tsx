/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FormInput } from "./form-input";

export interface LocationData {
  address: string;
  city: string;
  state: string;
  country: string;
  coordinates?: [number, number]; // [longitude, latitude] - Added coordinates
}

export type EventType = "remote" | "venue";

interface LocationSelectorProps {
  value?: LocationData | null;
  eventType?: EventType;
  onChange?: (location: LocationData | null) => void;
  onEventTypeChange?: (eventType: EventType) => void;
  error?: string;
  required?: boolean;
  mode?: "events" | "stays"; // New prop to determine display mode
}

export function LocationSelector({
  value,
  eventType = "venue", // Default to venue for stays
  onChange,
  onEventTypeChange,
  error,
  required = false,
  mode = "events", // Default to events mode for backward compatibility
}: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mapboxgl, setMapboxgl] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // For stays mode, always use venue type
  const actualEventType = mode === "stays" ? "venue" : eventType;

  // Ensure component is mounted before accessing browser APIs
  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamic import of mapbox-gl
  useEffect(() => {
    if (!mounted) return;

    const loadMapbox = async () => {
      try {
        const mapboxModule = await import("mapbox-gl");
        setMapboxgl(mapboxModule.default);
      } catch (error) {
        console.error("Failed to load mapbox-gl:", error);
      }
    };

    loadMapbox();
  }, [mounted]);

  // Check online status
  useEffect(() => {
    if (!mounted) return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [mounted]);

  // Handle search with debouncing
  const handleSearch = useCallback(
    async (query: string, updateInput: boolean = true) => {
      if (updateInput) {
        setSearchQuery(query);
      }

      if (
        query.length > 2 &&
        isOnline &&
        actualEventType === "venue" &&
        mapboxgl
      ) {
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              query
            )}.json?access_token=${mapboxgl.accessToken}&country=ng&limit=5`
          );
          const data = await response.json();

          if (data.features && data.features.length > 0) {
            setSuggestions(data.features);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        } catch (error) {
          console.error("Search error:", error);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    },
    [isOnline, actualEventType, mapboxgl]
  );

  // Initialize Mapbox
  useEffect(() => {
    if (
      !mounted ||
      !mapRef.current ||
      !isOnline ||
      actualEventType !== "venue" ||
      !mapboxgl
    )
      return;

    try {
      mapboxgl.accessToken =
        process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "your_mapbox_token_here";

      mapInstance.current = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [7.4951, 9.0579], // Nigeria coordinates
        zoom: 6,
        attributionControl: false,
      });

      // Add navigation control
      mapInstance.current.addControl(
        new mapboxgl.NavigationControl(),
        "top-right"
      );

      // Add click handler for map
      mapInstance.current.on("click", async (e: any) => {
        const { lng, lat } = e.lngLat;

        // Add/update marker
        if (markerRef.current) {
          markerRef.current.remove();
        }

        markerRef.current = new mapboxgl.Marker({
          color: "#FF5722",
        })
          .setLngLat([lng, lat])
          .addTo(mapInstance.current);

        // Reverse geocoding to get address
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}&country=ng`
          );
          const data = await response.json();

          if (data.features && data.features.length > 0) {
            const feature = data.features[0];
            const context = feature.context || [];

            const location: LocationData = {
              address: feature.place_name.split(",")[0] || "",
              city:
                context.find((c: any) => c.id.includes("place"))?.text || "",
              state:
                context.find((c: any) => c.id.includes("region"))?.text || "",
              country:
                context.find((c: any) => c.id.includes("country"))?.text ||
                "Nigeria",
              coordinates: [lng, lat], // Include coordinates from map click
            };

            onChange?.(location);
            setSearchQuery(feature.place_name);
          }
        } catch (error) {
          console.error("Geocoding error:", error);
        }
      });

      // Set initial location if value exists
      if (value) {
        handleSearch(value.address, false);
        
        // If coordinates exist, center map and add marker
        if (value.coordinates) {
          mapInstance.current.flyTo({
            center: value.coordinates,
            zoom: 14,
          });

          if (markerRef.current) {
            markerRef.current.remove();
          }

          markerRef.current = new mapboxgl.Marker({
            color: "#FF5722",
          })
            .setLngLat(value.coordinates)
            .addTo(mapInstance.current);
        }
      }
    } catch (error) {
      console.error("Mapbox initialization error:", error);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      if (markerRef.current) {
        markerRef.current = null;
      }
    };
  }, [
    mounted,
    isOnline,
    actualEventType,
    mapboxgl,
    value,
    onChange,
    handleSearch,
  ]);

  // Handle suggestion selection
  const handleSuggestionSelect = (feature: any) => {
    const context = feature.context || [];

    const location: LocationData = {
      address: feature.place_name.split(",")[0] || "",
      city: context.find((c: any) => c.id.includes("place"))?.text || "",
      state: context.find((c: any) => c.id.includes("region"))?.text || "",
      country:
        context.find((c: any) => c.id.includes("country"))?.text || "Nigeria",
      coordinates: feature.center, // Include coordinates from suggestion
    };

    onChange?.(location);
    setSearchQuery(feature.place_name);
    setShowSuggestions(false);

    // Update map center and add marker
    if (mapInstance.current && mapboxgl) {
      mapInstance.current.flyTo({
        center: feature.center,
        zoom: 14,
      });

      // Add/update marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      markerRef.current = new mapboxgl.Marker({
        color: "#FF5722",
      })
        .setLngLat(feature.center)
        .addTo(mapInstance.current);
    }
  };

  // Handle tab change (only for events mode)
  const handleTabChange = (newEventType: string) => {
    if (mode === "stays") return; // No tab changes in stays mode

    const eventTypeValue = newEventType as EventType;
    onEventTypeChange?.(eventTypeValue);

    if (eventTypeValue === "remote") {
      // Clear location data when switching to remote
      onChange?.(null);
      setSearchQuery("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex bg-gray-100 rounded-[12px] p-1 w-fit">
          <div className="px-6 py-2 rounded-[8px] text-sm font-medium bg-white text-gray-900 shadow-sm">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // Stays mode - no tabs, always show location input and map
  if (mode === "stays") {
    return (
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <FormInput
            placeholder="Find location*"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            error={error}
            required={required}
            className="w-full"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-[12px] shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                >
                  <div className="text-sm font-medium text-gray-900">
                    {suggestion.place_name.split(",")[0]}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {suggestion.place_name}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Location Info */}
        {value && value.coordinates && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            📍 Coordinates: {value.coordinates[1].toFixed(4)}, {value.coordinates[0].toFixed(4)}
          </div>
        )}

        {/* Map Container */}
        <div className="relative">
          <div
            ref={mapRef}
            className="w-full max-w-[565px] h-[198px] rounded-[24px] bg-gray-100 border border-gray-200 overflow-hidden"
            style={{ maxWidth: "100%" }}
          />

          {!isOnline && (
            <div className="absolute inset-0 bg-gray-100 rounded-[24px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Map unavailable offline</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Events mode - original implementation with tabs
  return (
    <div className="space-y-6">
      <Tabs value={eventType} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="remote">Online</TabsTrigger>
          <TabsTrigger value="venue">Venue</TabsTrigger>
        </TabsList>

        <TabsContent value="remote" className="space-y-4">
          <div className="w-full max-w-[565px] h-[198px] rounded-[24px] bg-[#D9D9D9] border border-gray-200 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-(--body-text) rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-3a5 5 0 00-5-5 5 5 0 00-5 5v3m0 0h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Online Event
            </h3>
            <p className="text-(--body-text) text-sm">
              This event will be hosted online. No physical location required.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="venue" className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <FormInput
              placeholder="Find location*"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              error={error}
              required={required}
              className="w-full"
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-[12px] shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {suggestion.place_name.split(",")[0]}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {suggestion.place_name}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map Container */}
          <div className="relative">
            <div
              ref={mapRef}
              className="w-full max-w-[565px] h-[198px] rounded-[24px] bg-gray-100 border border-gray-200 overflow-hidden"
              style={{ maxWidth: "100%" }}
            />

            {!isOnline && (
              <div className="absolute inset-0 bg-gray-100 rounded-[24px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">
                    Map unavailable offline
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}