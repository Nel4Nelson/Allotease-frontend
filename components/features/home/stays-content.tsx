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

interface StaysContentProps {
  className?: string;
}

export function StaysContent({ className = "" }: StaysContentProps) {
  const [selectedLocation, setSelectedLocation] = useState("awka-anambra");
  const [selectedType, setSelectedType] = useState("all");

  // API state
  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load stays function
  const loadStays = async (page: number = 1, append: boolean = false) => {
    try {
      setLoading(true);

      const params: GetStaysParams = {
        page,
        limit: 6,
        ...(selectedType && selectedType !== "all" && { accommodationType: selectedType }),
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
    } catch (error) {
      console.error("Failed to load stays:", error);
      toast.error("Failed to load accommodations. Please try again.");
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
    // TODO: Navigate to /stays/{stayId}
    console.log("Navigate to stay:", stayId);
    toast.success(`Stay ${stayId} clicked! Navigation coming soon.`);
  };

  // Show different buttons based on state
  const showMoreButton = hasNextPage && !loading;
  const showCollapseButton = currentPage > 1 && !loading;

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        {/* Phase 1: Content Header */}
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

        {/* Phase 2: Location Selector */}
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

      {/* Phase 3: Stays Cards */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px'
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

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="text-gray-500">Loading accommodations...</div>
        </div>
      )}

      {/* No Stays State */}
      {!loading && stays.length === 0 && !isInitialLoad && (
        <div className="flex flex-col items-center py-12 text-center">
          <div className="text-gray-500 mb-2">No accommodations found</div>
          <div className="text-sm text-gray-400">Try adjusting your filters</div>
        </div>
      )}

      {stays.length > 0 && (
        <div className="flex justify-center gap-4 pt-4">
          {showMoreButton && (
            <Button
              variant="signup-primary"
              size="allotease-md"
              onClick={handleShowMore}
              disabled={loading}
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
      )}
    </div>
  );
}