/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ContentHeader } from "@/components/ui/content-header";
import { SectionTitle } from "@/components/ui/section-title";
import { VariantSelect } from "@/components/ui/variant-select";
import { StayCard } from "@/components/ui/stays-card";
import { Button } from "@/components/ui/button";
import { StaysService, Stay, GetStaysParams } from "@/services/stays-service";
import { useRouter } from "next/navigation";
import { StaysGridSkeleton } from "@/components/ui/loading-skeletons/stay-card-skeleton";
import { NetworkError, EmptyState, OfflineState } from "@/components/ui/network-error";
import { useIsOnline } from "@/hooks/use-network-status";


interface StaysContentProps {
  className?: string;
}

export function StaysContent({ className = "" }: StaysContentProps) {
  const router = useRouter();
  const isOnline = useIsOnline();
  
  const [selectedLocation, setSelectedLocation] = useState("awka-anambra");
  const [selectedType, setSelectedType] = useState("all");

  // API state
  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load stays function with error handling
  const loadStays = async (page: number = 1, append: boolean = false) => {
    // Don't attempt to load if offline
    if (!isOnline) {
      setError("offline");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params: GetStaysParams = {
        page,
        limit: 6,
        ...(selectedType &&
          selectedType !== "all" && { accommodationType: selectedType }),
      };

      const response = await StaysService.getAllStays(params);

      if (response.status === "success") {
        const newStays = response.data.items;

        if (append) {
          // Append new stays to existing ones
          setStays((prev) => [...prev, ...newStays]);
        } else {
          // Replace stays (for filters or initial load)
          setStays(newStays);
        }

        setCurrentPage(response.data.page);
        setHasNextPage(response.data.hasNextPage);
      }
    } catch (error: any) {
      console.error("Failed to load stays:", error);
      
      // Set appropriate error message
      if (!isOnline) {
        setError("offline");
      } else if (error?.response?.status >= 500) {
        setError("server");
        toast.error("Server error. Please try again later.");
      } else if (error?.response?.status >= 400) {
        setError("request");
        toast.error("Failed to load accommodations. Please try again.");
      } else {
        setError("network");
      }
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadStays(1, false);
  }, []);

  // Reload when filters change
  useEffect(() => {
    if (!isInitialLoad) {
      setCurrentPage(1);
      loadStays(1, false);
    }
  }, [selectedType, selectedLocation, isInitialLoad]);

  // Reload when connection status changes
  useEffect(() => {
    if (isOnline && error === "offline" && !isInitialLoad) {
      loadStays(currentPage, false);
    }
  }, [isOnline]);

  // Show more stays
  const handleShowMore = () => {
    if (hasNextPage && !loading) {
      loadStays(currentPage + 1, true);
    }
  };

  // Collapse back to first 6
  const handleCollapse = () => {
    setCurrentPage(1);
    loadStays(1, false);
  };

  // Handle stay card click
  const handleStayClick = (stayId: string) => {
    router.push(`/${stayId}?type=stays`);
  };

  // Retry handler
  const handleRetry = () => {
    setError(null);
    loadStays(currentPage, false);
  };

  // Clear filters handler
  const handleClearFilters = () => {
    setSelectedType("all");
    setSelectedLocation("awka-anambra");
    setCurrentPage(1);
    loadStays(1, false);
  };

  // Show different buttons based on state
  const showMoreButton = hasNextPage && !loading && !error;
  const showCollapseButton = currentPage > 1 && !loading && !error;

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <ContentHeader
          title={<SectionTitle>Available accommodation near you</SectionTitle>}
          action={
            <VariantSelect
              variant="glass"
              placeholder="Type"
              value={selectedType}
              onValueChange={setSelectedType}
              options={[
                { value: "all", label: "All Types" },
                { value: "hotel & lodging", label: "Hotels & Lodging" },
                { value: "apartments", label: "Apartments" },
                { value: "guesthouses", label: "Guest Houses" },
                { value: "hostels", label: "Hostels" },
                { value: "resorts", label: "Resorts" },
              ]}
            />
          }
        />

        <VariantSelect
          variant="ghost"
          icon="/icons/location.svg"
          iconAlt="Location"
          value={selectedLocation}
          onValueChange={setSelectedLocation}
          options={[
            { value: "awka-anambra", label: "Awka, Anambra" },
            { value: "lagos-lagos", label: "Lagos, Lagos" },
            { value: "abuja-fct", label: "Abuja, FCT" },
            { value: "port-harcourt-rivers", label: "Port Harcourt, Rivers" },
            { value: "kano-kano", label: "Kano, Kano" },
            { value: "ibadan-oyo", label: "Ibadan, Oyo" },
          ]}
        />
      </div>

      {/* Loading State - Show skeleton on initial load */}
      {loading && isInitialLoad && (
        <StaysGridSkeleton count={6} />
      )}

      {/* Offline State */}
      {!loading && !isOnline && stays.length === 0 && (
        <OfflineState />
      )}

      {/* Error State */}
      {!loading && error && error !== "offline" && stays.length === 0 && (
        <NetworkError
          message={
            error === "server" 
              ? "Server is temporarily unavailable"
              : "Unable to load accommodations"
          }
          onRetry={handleRetry}
        />
      )}

      {/* Empty State */}
      {!loading && !error && stays.length === 0 && !isInitialLoad && (
        <EmptyState
          title="No accommodations found"
          message={
            selectedType !== "all" 
              ? "No accommodations match your selected filters. Try adjusting your search criteria."
              : "No accommodations available in this location."
          }
          actionLabel={selectedType !== "all" ? "Clear Filters" : undefined}
          onAction={selectedType !== "all" ? handleClearFilters : undefined}
        />
      )}

      {/* Stays Grid */}
      {stays.length > 0 && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
            }}
            className="w-full"
          >
            {stays.map((stay) => (
              <StayCard
                key={stay._id}
                title={stay.title}
                location={StaysService.formatStayLocation(stay.location)}
                rating={StaysService.getMockRating()}
                reviewCount={StaysService.getMockReviewCount()}
                description={stay.description}
                imageUrl={StaysService.getStayBannerImage(stay)}
                onClick={() => handleStayClick(stay._id)}
              />
            ))}
          </div>

          {/* Loading more indicator */}
          {loading && !isInitialLoad && (
            <div className="flex justify-center py-4">
              <div className="flex items-center gap-2 text-gray-500">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                <span>Loading more accommodations...</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            {showMoreButton && (
              <Button
                variant="signup-primary"
                size="allotease-md"
                onClick={handleShowMore}
                disabled={loading || !isOnline}
                loading={loading}
              >
                Show More
              </Button>
            )}

            {showCollapseButton && (
              <Button
                variant="allotease-blur"
                size="allotease-md"
                onClick={handleCollapse}
                disabled={loading}
              >
                Collapse
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}