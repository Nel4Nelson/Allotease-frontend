"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard, Listing } from "./listing-card";

interface StaysListingsProps {
  stays: Listing[];
  loading?: boolean;
  onCreateNew?: () => void;
}

export function StaysListings({
  stays,
  loading = false,
  onCreateNew,
}: StaysListingsProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-40"></div>
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-[200px] bg-gray-200 rounded-2xl"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2024] mb-1 font-space-grotesk">
            Created Stays
          </h2>
          <p className="text-[#71727A] text-sm">Accommodation you created</p>
        </div>
        <Button
          onClick={onCreateNew}
          variant="signup-primary"
          size="allotease-md"
          rightIcon={<Plus size={20} className="flex-shrink-0" />}
          className="w-full sm:w-auto min-w-[200px] h-12 sm:h-auto"
          aria-label="Sign up for a new account"
        >
          <span className="font-bold"> Create New Stay</span>
        </Button>
      </div>

      {/* Listings Grid */}
      {stays.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stays.map((stay) => (
            <ListingCard key={stay.id} listing={stay} showManageButton={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏨</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No stays created yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first accommodation listing to start accepting bookings.
          </p>
          <Button
            onClick={onCreateNew}
            className="flex items-center gap-2 bg-[#FF5B00] hover:bg-[#E04F00] text-white rounded-full px-6"
          >
            <Plus size={16} />
            Create Your First Stay
          </Button>
        </div>
      )}
    </div>
  );
}
