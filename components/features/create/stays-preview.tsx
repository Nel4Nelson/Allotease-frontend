"use client";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StaysBanner } from "@/components/ui/stays-banner";
import { StaysTitle } from "@/components/ui/stay-title";
import { StaysDescription } from "@/components/ui/stay-description";
import { StaysLocation } from "@/components/ui/stays-location";
import { StaysFacilitiesPreview } from "@/components/ui/stay-facilities-preview";
import { StaysUnitsPreview } from "@/components/ui/stays-units-preview";

interface StaysPreviewProps {
  className?: string;
}

// Component that uses useSearchParams
function StaysPreviewContent({ className = "" }: StaysPreviewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleReturnClick = () => {
    // Get the current type parameter and preserve it
    const currentType = searchParams.get("type");
    if (currentType) {
      router.push(`/allocation-admin/create?type=${currentType}`);
    } else {
      router.push("/allocation-admin/create");
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stays Banner - Full Width */}
      <StaysBanner />

      {/* Two Column Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column - Main Content (625px ≈ 64.8% ≈ 8 cols out of 12) */}
        <div className="col-span-8">
          {/* Stays Title Section */}
          <div className="mb-2">
            <StaysTitle />
          </div>

          {/* Stays Description Section */}
          <div className="mb-4">
            <StaysDescription />
          </div>

          {/* Location Section */}
          <div className="mb-8">
            <StaysLocation />
          </div>

          {/* Popular Facility Section */}
          <div className="mb-8">
            <StaysFacilitiesPreview />
          </div>

          {/* Available Section */}
          <div className="mb-8">
            <StaysUnitsPreview />
          </div>

          {/* Follow card Section */}
          <div className="mb-8"></div>

          {/* Error Message */}

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              size="allotease-md"
              onClick={handleReturnClick}
              className="text-(--body-text) hover:text-(--color-dark-slate)"
            >
              Return
            </Button>
          </div>
        </div>

        {/* Right Column - Registration Sidebar (remaining space ≈ 35.2% ≈ 4 cols out of 12) */}
        <div className="col-span-4">
          {/* Registration Card */}
          <div className="sticky top-8">
            {/* Registration content will go here */}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component that wraps the useSearchParams component in Suspense
export function StaysPreview({ className = "" }: StaysPreviewProps) {
  return (
    <Suspense fallback={<div>Loading preview...</div>}>
      <StaysPreviewContent className={className} />
    </Suspense>
  );
}