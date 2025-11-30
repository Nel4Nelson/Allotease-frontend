"use client";
import { useEffect } from "react";

interface GoogleMapsLoaderProps {
  apiKey: string;
}

export function GoogleMapsLoader({ apiKey }: GoogleMapsLoaderProps) {
  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existingScript) {
      return;
    }

    // Create script element
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.id = "google-maps-script"; // Add ID for easy identification

    // Add script to document
    document.head.appendChild(script);

    // No cleanup - keep the script loaded for the entire session
  }, [apiKey]);

  return null; // This component doesn't render anything
}

// Type declaration for window.google
declare global {
  interface Window {
    google: typeof google;
  }
}