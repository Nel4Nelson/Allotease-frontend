/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { useEventFormStore } from "@/stores/event-form-store";

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

const OnlineIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
  >
    <path
      d="M10 18.5C14.1421 18.5 17.5 15.1421 17.5 11C17.5 6.85786 14.1421 3.5 10 3.5C5.85786 3.5 2.5 6.85786 2.5 11C2.5 15.1421 5.85786 18.5 10 18.5Z"
      stroke="#1F3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 11H17.5"
      stroke="#1F3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 3.5C12.0711 5.82843 13.25 8.82843 13.25 12C13.25 15.1716 12.0711 18.1716 10 20.5C7.92893 18.1716 6.75 15.1716 6.75 12C6.75 8.82843 7.92893 5.82843 10 3.5Z"
      stroke="#1F3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface EventLocationProps {
  className?: string;
}

export function EventLocation({ className = "" }: EventLocationProps) {
  const { formData } = useEventFormStore();
  const [mounted, setMounted] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [mapboxgl, setMapboxgl] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

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

  // Initialize Mapbox for venue events only
  useEffect(() => {
    if (
      !mounted || 
      !mapRef.current || 
      !isOnline || 
      !mapboxgl || 
      formData.eventType !== "venue"
    ) return;

    try {
      mapboxgl.accessToken =
        process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "your_mapbox_token_here";

      mapInstance.current = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [7.4951, 9.0579], // Nigeria coordinates
        zoom: 6,
        attributionControl: false,
        interactive: true, // Allow zoom/pan
      });

      // Add navigation control
      mapInstance.current.addControl(
        new mapboxgl.NavigationControl(),
        "top-right"
      );

      // If location exists, center map and add marker
      if (formData.location && formData.location.address) {
        // Use coordinates if available, otherwise geocode
        if (formData.location.coordinates) {
          const [lng, lat] = formData.location.coordinates;
          
          // Center map on location
          mapInstance.current.flyTo({
            center: [lng, lat],
            zoom: 14,
          });

          // Add marker
          if (markerRef.current) {
            markerRef.current.remove();
          }

          markerRef.current = new mapboxgl.Marker({
            color: "#FF5722",
          })
            .setLngLat([lng, lat])
            .addTo(mapInstance.current);
        } else {
          // Geocode the address to get coordinates
          const geocodeAddress = async () => {
            try {
              const query = `${formData.location?.address}, ${formData.location?.city}, ${formData.location?.state}`;
              const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                  query
                )}.json?access_token=${mapboxgl.accessToken}&country=ng&limit=1`
              );
              const data = await response.json();

              if (data.features && data.features.length > 0) {
                const [lng, lat] = data.features[0].center;

                // Center map on location
                mapInstance.current.flyTo({
                  center: [lng, lat],
                  zoom: 14,
                });

                // Add marker
                if (markerRef.current) {
                  markerRef.current.remove();
                }

                markerRef.current = new mapboxgl.Marker({
                  color: "#FF5722",
                })
                  .setLngLat([lng, lat])
                  .addTo(mapInstance.current);
              }
            } catch (error) {
              console.error("Geocoding error:", error);
            }
          };

          geocodeAddress();
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
  }, [mounted, isOnline, mapboxgl, formData.location, formData.eventType]);

  // Don't render until mounted
  if (!mounted) {
    return <div className={className}>Loading location...</div>;
  }

  // Handle both remote and venue events
  const isRemoteEvent = formData.eventType === "remote";
  const isVenueEvent = formData.eventType === "venue";
  const location = formData.location;
  const onlineEventLink = formData.onlineEventLink;
  const hasLocation = location && location.address;
  const hasOnlineLink = onlineEventLink && onlineEventLink.trim().length > 0;

  // Render based on event type
  return (
    <div className={className}>
      {/* Section Title */}
      <h3 className="text-[var(--Title,#1F2024)] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px] mb-4">
        Location
      </h3>

      {/* Remote Event */}
      {isRemoteEvent && (
        <div className="flex items-start gap-3 mb-4">
          <div className="mt-[1px]">
            <OnlineIcon />
          </div>
          <div>
            <div className="text-[var(--Title,#1F2024)] font-source-sans-pro text-base font-semibold leading-[142.745%] tracking-[-0.32px]">
              Online Event
            </div>
            {hasOnlineLink ? (
              <div className="text-[var(--Body,#71727A)] font-source-sans-pro text-base font-normal leading-[142.745%] tracking-[-0.32px] mt-1 break-all">
                {onlineEventLink}
              </div>
            ) : (
              <div className="text-gray-400 font-source-sans-pro text-base font-normal leading-[142.745%] tracking-[-0.32px] mt-1">
                Meeting link will appear here
              </div>
            )}
          </div>
        </div>
      )}

      {/* Venue Event */}
      {isVenueEvent && (
        <>
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
                    {location.city}, {location.state}, {location.country}
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

          {/* Map - Only for venue events */}
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
        </>
      )}

      {/* Fallback for missing event type */}
      {!isRemoteEvent && !isVenueEvent && (
        <div className="flex items-start gap-3 mb-4">
          <div className="mt-[1px]">
            <LocationIcon />
          </div>
          <div>
            <div className="text-gray-400 font-source-sans-pro text-base font-semibold leading-[142.745%] tracking-[-0.32px]">
              Event Location
            </div>
            <div className="text-gray-400 font-source-sans-pro text-base font-normal leading-[142.745%] tracking-[-0.32px] mt-1">
              Select event type to see location details
            </div>
          </div>
        </div>
      )}
    </div>
  );
}