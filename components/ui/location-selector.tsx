/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FormInput } from "./form-input";

export interface LocationData {
  address: string;
  city: string;
  state: string;
  country: string;
  coordinates?: [number, number]; // [longitude, latitude]
}

export type EventType = "remote" | "venue";

interface LocationSelectorProps {
  value?: LocationData | null;
  eventType?: EventType;
  onChange?: (location: LocationData | null) => void;
  onEventTypeChange?: (eventType: EventType) => void;
  onOnlineEventChange?: (onlineEventDetails: string) => void;
  onlineEventValue?: string;
  error?: string;
  onlineEventError?: string;
  required?: boolean;
  mode?: "events" | "stays";
}

export function LocationSelector({
  value,
  eventType = "venue",
  onChange,
  onEventTypeChange,
  onOnlineEventChange,
  onlineEventValue = "",
  error,
  onlineEventError,
  required = false,
  mode = "events",
}: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);

  // For stays mode, always use venue type
  const actualEventType = mode === "stays" ? "venue" : eventType;

  // Ensure component is mounted before accessing browser APIs
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if Google Maps is already loaded (from GoogleMapsLoader in layout)
  useEffect(() => {
    if (!mounted) return;

    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsGoogleLoaded(true);
        return;
      }
      // Check again after a short delay
      setTimeout(checkGoogleMaps, 100);
    };

    checkGoogleMaps();
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

  // Parse Google Places result to LocationData
  const parseGooglePlaceToLocation = useCallback((place: google.maps.places.PlaceResult): LocationData => {
    let address = "";
    let city = "";
    let state = "";
    let country = "";

    // Extract address components
    if (place.address_components) {
      for (const component of place.address_components) {
        const types = component.types;

        if (types.includes("street_number") || types.includes("route")) {
          address += component.long_name + " ";
        }
        if (types.includes("locality") || types.includes("postal_town")) {
          city = component.long_name;
        }
        if (types.includes("administrative_area_level_1")) {
          state = component.long_name;
        }
        if (types.includes("country")) {
          country = component.long_name;
        }
      }
    }

    // If address is empty, use formatted address
    if (!address.trim() && place.formatted_address) {
      address = place.formatted_address.split(",")[0];
    }

    const coordinates: [number, number] | undefined = place.geometry?.location
      ? [place.geometry.location.lng(), place.geometry.location.lat()]
      : undefined;

    return {
      address: address.trim() || place.name || "",
      city,
      state,
      country,
      coordinates,
    };
  }, []);

  // Handle getting user's precise location with improved GPS handling
  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        console.log('Location accuracy:', position.coords.accuracy, 'meters');

        // Update map center
        if (mapInstance.current) {
          mapInstance.current.setCenter({ lat, lng });
          mapInstance.current.setZoom(18); // Zoom in close for precise location

          // Remove old marker
          if (markerRef.current) {
            markerRef.current.setMap(null);
          }

          // Add a marker for user location
          markerRef.current = new google.maps.Marker({
            position: { lat, lng },
            map: mapInstance.current,
            animation: google.maps.Animation.DROP,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
          });

          // Reverse geocode to get address
          if (geocoder.current) {
            geocoder.current.geocode(
              { location: { lat, lng } },
              (results, status) => {
                if (status === "OK" && results && results[0]) {
                  const location = parseGooglePlaceToLocation(results[0]);
                  onChange?.(location);
                  setSearchQuery(results[0].formatted_address || "");
                } else {
                  // If reverse geocoding fails, still save the coordinates
                  onChange?.({
                    address: "Current Location",
                    city: "",
                    state: "",
                    country: "",
                    coordinates: [lng, lat],
                  });
                  setSearchQuery("Current Location");
                }
                setIsGettingLocation(false);
              }
            );
          } else {
            setIsGettingLocation(false);
          }
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsGettingLocation(false);

        let errorMessage = "Unable to get your location";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Location permission denied. Please enable location access in your browser settings.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Location information unavailable. Make sure GPS is enabled.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "Location request timed out. Please try again.";
        }

        setLocationError(errorMessage);
      },
      {
        enableHighAccuracy: true,  // Force GPS usage
        timeout: 30000,            // 30 seconds timeout for GPS lock
        maximumAge: 0,             // Don't use cached position
      }
    );
  }, [onChange, parseGooglePlaceToLocation]);

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
    
    // Trigger map resize after state change
    setTimeout(() => {
      if (mapInstance.current) {
        google.maps.event.trigger(mapInstance.current, "resize");
        // Re-center map if we have coordinates
        if (value?.coordinates) {
          const [lng, lat] = value.coordinates;
          mapInstance.current.setCenter({ lat, lng });
        }
      }
    }, 100);
  }, [value]);

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
        isGoogleLoaded &&
        autocompleteService.current
      ) {
        try {
          const request: google.maps.places.AutocompletionRequest = {
            input: query,
            componentRestrictions: { country: "ng" }, // Restrict to Nigeria
          };

          autocompleteService.current.getPlacePredictions(
            request,
            (predictions, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                predictions
              ) {
                setSuggestions(predictions);
                setShowSuggestions(true);
              } else {
                setSuggestions([]);
                setShowSuggestions(false);
              }
            }
          );
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
    [isOnline, actualEventType, isGoogleLoaded]
  );

  // Initialize Google Maps
  useEffect(() => {
    if (
      !mounted ||
      !mapRef.current ||
      !isOnline ||
      actualEventType !== "venue" ||
      !isGoogleLoaded
    )
      return;

    try {
      // Initialize map centered on Nigeria
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: { lat: 9.0579, lng: 7.4951 }, // Nigeria coordinates
        zoom: 6,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      // Initialize services
      autocompleteService.current = new google.maps.places.AutocompleteService();
      placesService.current = new google.maps.places.PlacesService(mapInstance.current);
      geocoder.current = new google.maps.Geocoder();

      // Add click handler for map
      mapInstance.current.addListener("click", async (e: google.maps.MapMouseEvent) => {
        if (!e.latLng || !geocoder.current) return;

        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        // Add/update marker
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        markerRef.current = new google.maps.Marker({
          position: { lat, lng },
          map: mapInstance.current,
          animation: google.maps.Animation.DROP,
        });

        // Reverse geocoding to get address
        try {
          geocoder.current.geocode(
            { location: { lat, lng } },
            (results, status) => {
              if (status === "OK" && results && results[0]) {
                const location = parseGooglePlaceToLocation(results[0]);
                onChange?.(location);
                setSearchQuery(results[0].formatted_address || "");
              }
            }
          );
        } catch (error) {
          console.error("Geocoding error:", error);
        }
      });

      // Set initial location if value exists
      if (value && value.coordinates) {
        const [lng, lat] = value.coordinates;

        mapInstance.current.setCenter({ lat, lng });
        mapInstance.current.setZoom(14);

        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        markerRef.current = new google.maps.Marker({
          position: { lat, lng },
          map: mapInstance.current,
          animation: google.maps.Animation.DROP,
        });

        setSearchQuery(value.address);
      }
    } catch (error) {
      console.error("Google Maps initialization error:", error);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      mapInstance.current = null;
    };
  }, [
    mounted,
    isOnline,
    actualEventType,
    isGoogleLoaded,
    value,
    onChange,
    parseGooglePlaceToLocation,
  ]);

  // Handle suggestion selection
  const handleSuggestionSelect = (prediction: google.maps.places.AutocompletePrediction) => {
    if (!placesService.current) return;

    const request: google.maps.places.PlaceDetailsRequest = {
      placeId: prediction.place_id,
      fields: ["address_components", "geometry", "formatted_address", "name"],
    };

    placesService.current.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        const location = parseGooglePlaceToLocation(place);

        onChange?.(location);
        setSearchQuery(prediction.description);
        setShowSuggestions(false);

        // Update map center and add marker
        if (mapInstance.current && place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          mapInstance.current.setCenter({ lat, lng });
          mapInstance.current.setZoom(14);

          // Add/update marker
          if (markerRef.current) {
            markerRef.current.setMap(null);
          }

          markerRef.current = new google.maps.Marker({
            position: { lat, lng },
            map: mapInstance.current,
            animation: google.maps.Animation.DROP,
          });
        }
      }
    });
  };

  // Handle tab change (only for events mode)
  const handleTabChange = (newEventType: string) => {
    if (mode === "stays") return;

    const eventTypeValue = newEventType as EventType;
    onEventTypeChange?.(eventTypeValue);

    if (eventTypeValue === "remote") {
      onChange?.(null);
      setSearchQuery("");
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      onOnlineEventChange?.("");
    }
  };

  // Handle online event input change
  const handleOnlineEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onOnlineEventChange?.(e.target.value);
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

  // Render map component (used in both modes)
  const renderMapComponent = () => (
    <div className="space-y-4">
      {/* Action Buttons - Matching LocationSearch Style */}
      <div className="flex items-center gap-2">
        {/* Use My Location Button - Exact LocationSearch Style */}
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={isGettingLocation || !isOnline || !isGoogleLoaded}
          className="flex items-center gap-2 px-4 h-10 rounded-full border border-gray-300/20 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          title="Use my current location"
        >
          {isGettingLocation ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">Getting...</span>
            </>
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="2" x2="12" y2="4" />
                <line x1="12" y1="20" x2="12" y2="22" />
                <line x1="2" y1="12" x2="4" y2="12" />
                <line x1="20" y1="12" x2="22" y2="12" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Use My Location</span>
            </>
          )}
        </button>
        
        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="flex items-center gap-2 px-4 h-10 rounded-full border border-gray-300/20 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap"
        >
          {isFullscreen ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Exit Fullscreen</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5.25 5.25M20 8V4m0 0h-4m4 0l-5.25 5.25M4 16v4m0 0h4m-4 0l5.25-5.25M20 16v4m0 0h-4m4 0l-5.25-5.25" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Fullscreen Map</span>
            </>
          )}
        </button>
      </div>

      {/* Location Error Message */}
      {locationError && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          {locationError}
        </div>
      )}

      {/* Selected Location Info */}
      {value && value.coordinates && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          📍 Coordinates: {value.coordinates[1].toFixed(6)}, {value.coordinates[0].toFixed(6)}
          <span className="text-gray-500 ml-2">(High precision)</span>
        </div>
      )}

      {/* Map Container */}
      <div className="relative">
        <div
          ref={mapRef}
          className={`w-full bg-gray-100 border border-gray-200 overflow-hidden transition-all duration-300 ${
            isFullscreen 
              ? "fixed inset-0 z-50 rounded-none h-screen" 
              : "max-w-[565px] h-[198px] rounded-[24px]"
          }`}
          style={!isFullscreen ? { maxWidth: "100%" } : {}}
        />

        {/* Fullscreen close button - Improved Style */}
        {isFullscreen && (
          <button
            type="button"
            onClick={toggleFullscreen}
            className="fixed top-4 right-4 z-[60] flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 rounded-full shadow-lg border border-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Close Map</span>
          </button>
        )}

        {!isOnline && (
          <div className="absolute inset-0 bg-gray-100 rounded-[24px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">Map unavailable offline</p>
            </div>
          </div>
        )}

        {!isGoogleLoaded && isOnline && (
          <div className="absolute inset-0 bg-gray-100 rounded-[24px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

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
                    {suggestion.structured_formatting.main_text}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {suggestion.description}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {renderMapComponent()}
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
          {/* Online Event Input */}
          <FormInput
            placeholder="Enter meeting link or event details*"
            value={onlineEventValue || ""}
            onChange={handleOnlineEventChange}
            error={onlineEventError}
            required={required}
            className="w-full"
            label="Online event details"
            showLabel={false}
          />

          {/* Optional: Helper text */}
          <p className="text-sm text-gray-600">
            Add your Zoom link, Google Meet URL, or other online event details here.
          </p>
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
                      {suggestion.structured_formatting.main_text}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {suggestion.description}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {renderMapComponent()}
        </TabsContent>
      </Tabs>
    </div>
  );
}