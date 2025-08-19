import { Button } from "@/components/ui/button";
import { StayCard } from "./ticket-stay-card";
import { useState } from "react";
import { useActiveStays } from "@/hooks/use-stays-ticket";

interface TicketStaysActiveProps {
  className?: string;
}

export function TicketStaysActive({ className = "" }: TicketStaysActiveProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: activeStaysData,
    isLoading,
    error,
    refetch,
  } = useActiveStays({
    page: currentPage,
    limit: itemsPerPage,
  });

  const handleShowMore = () => {
    if (activeStaysData?.data.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleCollapse = () => {
    setCurrentPage(1);
  };

  const stays = activeStaysData?.data.items || [];
  const totalStays = activeStaysData?.data.totalCount || 0;
  const hasMore = activeStaysData?.data.hasNextPage || false;

  // Deduplicate stays to prevent duplicate keys
  const uniqueStays = stays.filter((stay, index, array) => 
    array.findIndex(s => s._id === stay._id) === index
  );

  // Loading state
  if (isLoading && currentPage === 1) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`loading-${index}`}
            className="flex gap-4 p-4 bg-gray-100 rounded-lg animate-pulse"
          >
            <div className="w-32 h-24 bg-gray-200 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
            <div className="w-20 h-6 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-red-600 text-lg font-semibold mb-2">
          Failed to load active stays
        </div>
        <button onClick={() => refetch()} className="text-gray-500 underline">
          Try again
        </button>
      </div>
    );
  }

  // Empty state
  if (uniqueStays.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No active stays
        </h3>
        <p className="text-gray-500">
          Your confirmed and upcoming stays will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Active Stays List */}
      <div className="space-y-4">
        {uniqueStays.map((stay, index) => (
          <StayCard 
            key={`${stay._id}-${currentPage}-${index}`} 
            stay={stay} 
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalStays > itemsPerPage && (
        <div className="flex justify-center gap-4 pt-4">
          {hasMore && (
            <Button
              variant="signup-primary"
              size="allotease-md"
              onClick={handleShowMore}
              disabled={isLoading}
              loading={isLoading}
            >
              Show More
            </Button>
          )}

          {currentPage > 1 && (
            <Button
              variant="allotease-blur"
              size="allotease-md"
              onClick={handleCollapse}
              disabled={isLoading}
            >
              Collapse
            </Button>
          )}
        </div>
      )}
    </div>
  );
}