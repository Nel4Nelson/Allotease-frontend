"use client";
import { useState, useRef, useEffect } from "react";
import { SearchIcon } from "@/components/icons";

interface LocationCoordinates {
  lat: number;
  lng: number;
}

interface LocationSearchProps {
  onLocationSelect: (coordinates: LocationCoordinates, placeName: string) => void;
  placeholder?: string;
  className?: string;
}

export function LocationSearch({
  onLocationSelect,
  placeholder = "Search location...",
  className = "",
}: LocationSearchProps) {
  const [inputValue, setInputValue] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    // Initialize autocomplete with Nigeria bias
    autocompleteRef.current = new google.maps.places.Autocomplete(
      inputRef.current,
      {
        componentRestrictions: { country: "ng" }, // Restrict to Nigeria
        fields: ["geometry", "name", "formatted_address"],
        types: ["geocode", "establishment"], // Allow cities, addresses, and places
      }
    );

    // Listen for place selection
    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();

      if (place?.geometry?.location) {
        const coordinates = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        const placeName = place.formatted_address || place.name || "";
        setInputValue(placeName);
        onLocationSelect(coordinates, placeName);
      }
    });

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onLocationSelect]);

  // Get user's current location with better GPS handling
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);

    // First, try to get a quick low-accuracy position, then improve it
    let gotHighAccuracy = false;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // Only process high accuracy result, or low accuracy if high accuracy fails
        if (position.coords.accuracy <= 100 || !gotHighAccuracy) {
          gotHighAccuracy = position.coords.accuracy <= 100;

          const coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          console.log('Location accuracy:', position.coords.accuracy, 'meters');

          // Reverse geocode to get place name
          try {
            const geocoder = new google.maps.Geocoder();
            const response = await geocoder.geocode({ location: coordinates });

            if (response.results[0]) {
              const placeName = response.results[0].formatted_address;
              setInputValue(placeName);
              onLocationSelect(coordinates, placeName);
            } else {
              setInputValue("Current Location");
              onLocationSelect(coordinates, "Current Location");
            }
          } catch (error) {
            console.error("Reverse geocoding failed:", error);
            setInputValue("Current Location");
            onLocationSelect(coordinates, "Current Location");
          } finally {
            setIsLoadingLocation(false);
          }
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLoadingLocation(false);

        let errorMessage = "Unable to get your location";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Location permission denied. Please enable location access in your browser settings.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Location information unavailable. Make sure GPS is enabled.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "Location request timed out. Please try again.";
        }

        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,  // This forces GPS usage
        timeout: 30000,            // Increased timeout to 30 seconds for GPS lock
        maximumAge: 0,             // Don't use cached position
      }
    );
  };

  return (
    <div className={`flex flex-col md:flex-row items-stretch md:items-center gap-2 ${className}`}>
      {/* Location Search Input */}
      <div className="flex items-center gap-3 h-10 w-full md:max-w-[300px] px-3 md:flex-1 rounded-full border border-gray-300/20 bg-gray-100/50">
        <SearchIcon />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-gray-600 font-source-sans text-sm placeholder:text-gray-500"
          style={{ color: "#71727A" }}
        />
      </div>

      {/* Use My Location Button */}
      <button
        onClick={handleGetCurrentLocation}
        disabled={isLoadingLocation}
        className="flex items-center justify-center md:justify-start gap-2 px-4 h-10 w-full md:w-auto rounded-full border border-gray-300/20 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        title="Use my current location"
      >
        {isLoadingLocation ? (
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
    </div>
  );
}