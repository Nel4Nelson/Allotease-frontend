import React, { useEffect, useRef, useState } from "react";

const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
  >
    <path
      d="M10 18C14.1421 18 17.5 14.6421 17.5 10.5C17.5 6.35786 14.1421 3 10 3C5.85786 3 2.5 6.35786 2.5 10.5C2.5 14.6421 5.85786 18 10 18Z"
      stroke="#1F3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.7344 13.8128L12.4922 11.2035C12.4192 11.1565 12.3363 11.1271 12.25 11.1175L10.4609 10.8753C10.3275 10.8562 10.1914 10.8818 10.0741 10.9483C9.95671 11.0147 9.86472 11.1182 9.8125 11.2425L8.74219 13.641C8.69187 13.7525 8.67542 13.8764 8.69486 13.9972C8.7143 14.118 8.76879 14.2305 8.85156 14.3206L10.3203 15.9066C10.3867 15.9795 10.4354 16.0669 10.4625 16.1617C10.4896 16.2566 10.4944 16.3564 10.4766 16.4535L10.1719 18.0003"
      stroke="#1F3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.07814 4.84375L4.37501 6.5C4.31377 6.64704 4.31097 6.81191 4.3672 6.96094L5.26564 9.35156C5.30075 9.45121 5.36085 9.54017 5.44019 9.60993C5.51953 9.67969 5.61545 9.72792 5.71876 9.75L7.39064 10.1094C7.48343 10.1281 7.57058 10.1683 7.64516 10.2266C7.71975 10.2849 7.77972 10.3598 7.82033 10.4453L8.1172 11.0625C8.16995 11.1669 8.25025 11.2548 8.34941 11.3168C8.44856 11.3787 8.56278 11.4124 8.6797 11.4141H9.73439"
      stroke="#1F3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.9141 3.24219L12.6406 4.55469C12.7077 4.67808 12.7318 4.82029 12.7092 4.9589C12.6866 5.09751 12.6185 5.22466 12.5156 5.32031L10.4141 7.21875C10.3789 7.25234 10.3395 7.28123 10.2969 7.30469L9.33594 7.83594C9.24433 7.88454 9.14272 7.91128 9.03906 7.91406H7.36719C7.24402 7.91469 7.12372 7.95124 7.02103 8.01924C6.91834 8.08724 6.83772 8.18373 6.78906 8.29688L6.14062 9.83594"
      stroke="#1F3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M8.33333 10.8333C8.69054 11.3118 9.14776 11.7074 9.67247 11.9939C10.1972 12.2805 10.7764 12.4514 11.3717 12.4958C11.967 12.5402 12.5651 12.4571 13.1268 12.2519C13.6884 12.0467 14.2011 11.7241 14.6333 11.3042L17.1333 8.80417C17.9617 7.94749 18.4204 6.80401 18.4108 5.61601C18.4012 4.42802 17.9241 3.29208 17.0818 2.44979C16.2395 1.6075 15.1036 1.13041 13.9156 1.12081C12.7276 1.11121 11.5841 1.56989 10.7275 2.39833L9.16667 3.95"
      stroke="#15BA6B"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.6667 9.16667C11.3095 8.68815 10.8522 8.29255 10.3275 8.00601C9.80281 7.71947 9.22362 7.54862 8.62831 7.50423C8.033 7.45983 7.43491 7.54288 6.87325 7.74808C6.31159 7.95329 5.79889 8.27588 5.36667 8.69583L2.86667 11.1958C2.03822 12.0525 1.57954 13.196 1.58914 14.384C1.59874 15.572 2.07584 16.7079 2.91812 17.5502C3.76041 18.3925 4.89635 18.8696 6.08435 18.8792C7.27234 18.8888 8.41582 18.4301 9.2725 17.6017L10.825 16.05"
      stroke="#15BA6B"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DirectionsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 6.25V10L12.5 11.875"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface EventDetailsLocationProps {
  eventType: "remote" | "physical";
  link?: string;
  location?: {
    country: string;
    city?: string;
    state?: string;
    address?: string;
  };
  geoLocation?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  className?: string;
}

export function EventDetailsLocation({
  eventType,
  link,
  location,
  geoLocation,
  className = "",
}: EventDetailsLocationProps) {
  const [mounted, setMounted] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  // Ensure component is mounted before accessing browser APIs
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if Google Maps is already loaded
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

  // Initialize Google Maps for physical events
  useEffect(() => {
    if (!mounted || !mapRef.current || !isOnline || !isGoogleLoaded) return;

    // Only initialize map for physical events
    if (eventType !== "physical") return;

    try {
      // Initialize map centered on Nigeria
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: { lat: 9.0579, lng: 7.4951 }, // Default Nigeria coordinates
        zoom: 6,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      // Get coordinates - priority: geoLocation > geocode address
      let coordinates: { lat: number; lng: number } | null = null;

      // Check if we have stored coordinates
      if (
        geoLocation &&
        geoLocation.coordinates &&
        geoLocation.coordinates.length === 2
      ) {
        const [lng, lat] = geoLocation.coordinates;
        coordinates = { lat, lng };
      }

      // If we have coordinates, center map and add marker
      if (coordinates) {
        mapInstance.current.setCenter(coordinates);
        mapInstance.current.setZoom(14);

        // Add marker
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        markerRef.current = new google.maps.Marker({
          position: coordinates,
          map: mapInstance.current,
          animation: google.maps.Animation.DROP,
          title: "Event Location",
        });
      } else if (location && location.address) {
        // Fallback: If we have address but no coordinates, geocode it
        const geocoder = new google.maps.Geocoder();
        const query = `${location.address}, ${location.city}, ${location.state}, ${location.country}`;

        geocoder.geocode({ address: query }, (results, status) => {
          if (status === "OK" && results && results[0] && mapInstance.current) {
            const locationResult = results[0].geometry.location;
            const lat = locationResult.lat();
            const lng = locationResult.lng();

            // Center map on location
            mapInstance.current.setCenter({ lat, lng });
            mapInstance.current.setZoom(14);

            // Add marker
            if (markerRef.current) {
              markerRef.current.setMap(null);
            }

            markerRef.current = new google.maps.Marker({
              position: { lat, lng },
              map: mapInstance.current,
              animation: google.maps.Animation.DROP,
              title: location.address || "Event Location",
            });
          }
        });
      }
    } catch (error) {
      console.error("Google Maps initialization error:", error);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      // Don't destroy map instance to prevent re-initialization
    };
  }, [mounted, isOnline, isGoogleLoaded, eventType, location, geoLocation]);

  // Generate Google Maps URL for directions
  const getGoogleMapsUrl = (): string => {
    // Priority 1: Use coordinates if available (most accurate)
    if (
      geoLocation &&
      geoLocation.coordinates &&
      geoLocation.coordinates.length === 2
    ) {
      const [lng, lat] = geoLocation.coordinates;
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }

    // Priority 2: Use address
    if (location && location.address) {
      const address = `${location.address}, ${location.city}, ${location.state}, ${location.country}`;
      const encodedAddress = encodeURIComponent(address);
      return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    }

    // Fallback: General search
    return "https://www.google.com/maps";
  };

  // Handle copy link to clipboard
  const handleCopyLink = async () => {
    if (!link) return;

    try {
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  // Don't render until mounted
  if (!mounted) {
    return <div className={className}>Loading location...</div>;
  }

  // Handle event location display based on event type
  const hasLocation = location && location.address;
  const googleMapsUrl = getGoogleMapsUrl();

  // For remote events, show meeting link
  if (eventType === "remote") {
    return (
      <div className={className}>
        {/* Section Title */}
        <h3 className="text-[var(--Title,#1F2024)] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px] mb-4">
          Location
        </h3>

        {/* Remote Event Info */}
        <div className="flex items-start gap-3 mb-4">
          <div className="mt-[1px]">
            <LocationIcon />
          </div>
          <div>
            <div className="text-[var(--Title,#1F2024)] font-source-sans-pro text-base font-semibold leading-[142.745%] tracking-[-0.32px]">
              Online Event
            </div>
            <div className="text-[var(--Body,#71727A)] font-source-sans-pro text-base font-normal leading-[142.745%] tracking-[-0.32px] mt-1">
              Join from anywhere with an internet connection
            </div>
          </div>
        </div>

        {/* Meeting Link Card */}
        {link ? (
          <div className="w-full max-w-[565px] rounded-[24px] bg-[#E3F5EB] border border-[rgba(21,186,107,0.20)] p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <LinkIcon />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[var(--Title,#1F2024)] font-source-sans-pro text-base font-semibold leading-[142.745%] tracking-[-0.32px] mb-2">
                  Meeting Link
                </h4>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#15BA6B] font-source-sans-pro text-sm font-normal leading-[142.745%] tracking-[-0.28px] break-all hover:underline"
                >
                  {link}
                </a>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 rounded-lg bg-white border border-[rgba(21,186,107,0.30)] text-[#15BA6B] font-source-sans-pro text-sm font-semibold hover:bg-[rgba(21,186,107,0.05)] transition-colors"
                  >
                    {linkCopied ? "Copied!" : "Copy Link"}
                  </button>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-[#15BA6B] text-white font-source-sans-pro text-sm font-semibold hover:bg-[#139B5A] transition-colors"
                  >
                    Open Link
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[565px] h-[198px] rounded-[24px] bg-[#D9D9D9] border border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-800 font-semibold text-lg mb-2">
                Online Event
              </p>
              <p className="text-gray-600 text-sm">
                Access details will be provided after registration
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // For physical events, show location and map
  return (
    <div className={className}>
      {/* Section Title */}
      <h3 className="text-[var(--Title,#1F2024)] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px] mb-4">
        Location
      </h3>

      {/* Location Info */}
      <div className="flex items-start gap-3 mb-4">
        <div className="mt-[1px]">
          <LocationIcon />
        </div>
        <div>
          {hasLocation ? (
            <>
              {/* Address (Primary) */}
              <div className="text-[var(--Title,#1F2024)] font-source-sans-pro text-base font-semibold leading-[142.745%] tracking-[-0.32px]">
                {location.address}
              </div>
              {/* City, State (Secondary) */}
              <div className="text-[var(--Body,#71727A)] font-source-sans-pro text-base font-normal leading-[142.745%] tracking-[-0.32px] mt-1">
                {location.city && location.state
                  ? `${location.city}, ${location.state}, ${location.country}`
                  : location.country}
              </div>
            </>
          ) : (
            <>
              {/* Placeholder */}
              <div className="text-gray-400 font-source-sans-pro text-base font-semibold leading-[142.745%] tracking-[-0.32px]">
                Event Address
              </div>
              <div className="text-gray-400 font-source-sans-pro text-base font-normal leading-[142.745%] tracking-[-0.32px] mt-1">
                City, State, Country will appear here
              </div>
            </>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="relative mb-4">
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

        {!isGoogleLoaded && isOnline && (
          <div className="absolute inset-0 bg-gray-100 rounded-[24px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Get Directions Button */}
      {hasLocation && (
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--feature-accent-orange)] hover:bg-[#E54A00] text-white rounded-full transition-colors duration-200 font-source-sans-pro font-semibold text-sm"
        >
          <DirectionsIcon />
          Get Directions
        </a>
      )}
    </div>
  );
}