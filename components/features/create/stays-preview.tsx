"use client";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StaysBanner } from "@/components/ui/stays-banner";
import { StaysTitle } from "@/components/ui/stay-title";
import { StaysDescription } from "@/components/ui/stay-description";
import { StaysLocation } from "@/components/ui/stays-location";
import { StaysFacilitiesPreview } from "@/components/ui/stay-facilities-preview";
import { StaysUnitsPreview } from "@/components/ui/stays-units-preview";
import { CreateStaysModal } from "@/components/ui/modals/create-stays-modal";
import { useDebouncedStaysFormStore } from "@/hooks/use-debounced-stay-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StaysPreviewProps {
  className?: string;
}

// Component that uses useSearchParams
function StaysPreviewContent({ className = "" }: StaysPreviewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { isFormComplete, getMissingFields } = useDebouncedStaysFormStore();

  const isComplete = isFormComplete();
  const missingFields = getMissingFields();

  const handleReturnClick = () => {
    // Get the current type parameter and preserve it
    const currentType = searchParams.get("type");
    if (currentType) {
      router.push(`/allocation-admin/create?type=${currentType}`);
    } else {
      router.push("/allocation-admin/create");
    }
  };

  const handleCreateStays = () => {
    if (isComplete) {
      setIsCreateModalOpen(true);
    }
  };

  const handleCreateSuccess = () => {
    // Redirect to homepage with type parameter
    const stayType = searchParams.get("type") || "stays";
    router.push(`/?type=${stayType}`);
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
          <div className="mb-8">
            {/* UserProfileFollowCard can be added here if needed */}
          </div>

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

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      type="button"
                      variant="signup-primary"
                      size="allotease-md"
                      onClick={handleCreateStays}
                      disabled={!isComplete}
                      className={
                        !isComplete ? "cursor-not-allowed opacity-50" : ""
                      }
                    >
                      Create Stays
                    </Button>
                  </div>
                </TooltipTrigger>
                {!isComplete && (
                  <TooltipContent side="top" className="max-w-xs p-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">
                        Complete these fields:
                      </p>
                      <ul className="text-xs space-y-1">
                        {missingFields.map((field, index) => (
                          <li key={index}>• {field}</li>
                        ))}
                      </ul>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Right Column - Registration Sidebar (remaining space ≈ 35.2% ≈ 4 cols out of 12) */}
        <div className="col-span-4">
          {/* Registration Card */}
          <div className="sticky top-8">
            {/* Future booking/registration content */}
            <div className="p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-[var(--Title,#1F2024)] mb-4">
                Accommodation Preview
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                This is how your accommodation will appear to potential guests.
              </p>
              
              {/* Quick Stats */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Form Completion</span>
                  <span className={`text-sm font-medium ${isComplete ? 'text-green-600' : 'text-orange-600'}`}>
                    {isComplete ? '✓ Complete' : `${missingFields.length} field(s) missing`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Stays Modal */}
      <CreateStaysModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
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