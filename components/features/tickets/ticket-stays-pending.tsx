/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";
import { PendingStayCard } from "@/components/ui/pending-stay-card";
import { Button } from "@/components/ui/button";
import { useConfirmBooking, useTransformedPendingStays } from "@/hooks/use-stays-ticket";

export function TicketStaysPending() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch pending stays using custom hook
  const {
    data: pendingStaysData,
    transformedStays,
    isLoading,
    error,
    refetch
  } = useTransformedPendingStays({
    page: currentPage,
    limit: itemsPerPage
  });

  // Mutation for accepting/refunding stays
  const confirmBookingMutation = useConfirmBooking();

  // Handle accept action
  const handleAccept = async (id: string) => {
    const stay = transformedStays.find(s => s._id === id);
    if (!stay) return;

    confirmBookingMutation.mutate({
      bookingId: stay.bookingId,
      confirm: true
    });
  };

  // Handle refund action
  const handleRefund = async (id: string) => {
    const stay = transformedStays.find(s => s._id === id);
    if (!stay) return;

    confirmBookingMutation.mutate({
      bookingId: stay.bookingId,
      confirm: false
    });
  };

  // Handle show more
  const handleShowMore = () => {
    if (pendingStaysData?.data.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Handle collapse
  const handleCollapse = () => {
    setCurrentPage(1);
  };

  const totalStays = pendingStaysData?.data.totalCount || 0;
  const hasMore = pendingStaysData?.data.hasNextPage || false;
  const isProcessing = confirmBookingMutation.isPending;

  // Deduplicate stays to prevent duplicate keys
  const uniqueStays = transformedStays.filter((stay, index, array) => 
    array.findIndex(s => s._id === stay._id) === index
  );

  // Loading state
  if (isLoading && currentPage === 1) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-2">
            Pending Stay Confirmations
          </h2>
          <p className="text-[#7A7A7A] font-source-sans-pro text-base font-normal leading-[160%] mb-4">
            These are your recently booked accommodations awaiting confirmation. You have a 3-day window to confirm your booking. 
            If you're satisfied with your choice, click "Accept" to confirm your payment. If you'd like to cancel, click "Refund" 
            to request a full refund.
          </p>
        </div>
        
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`loading-${index}`}
              className="flex gap-4 p-4 bg-gray-100 rounded-lg animate-pulse"
            >
              <div className="w-32 h-24 bg-gray-200 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-20 h-8 bg-gray-200 rounded" />
                <div className="w-20 h-8 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-2">
            Pending Stay Confirmations
          </h2>
          <p className="text-[#7A7A7A] font-source-sans-pro text-base font-normal leading-[160%] mb-4">
            These are your recently booked accommodations awaiting confirmation.
          </p>
        </div>
        
        <div className="text-center py-12">
          <div className="text-red-600 text-lg font-semibold mb-2">
            Failed to load pending stays
          </div>
          <button
            onClick={() => refetch()}
            className="text-gray-500 underline hover:text-gray-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title and Description */}
      <div>
        <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-2">
          Pending Stay Confirmations
        </h2>
        <p className="text-[#7A7A7A] font-source-sans-pro text-base font-normal leading-[160%] mb-4">
          These are your recently booked accommodations awaiting confirmation. You have a 3-day window to confirm your booking. 
          If you're satisfied with your choice, click "Accept" to confirm your payment. If you'd like to cancel, click "Refund" 
          to request a full refund.
        </p>
      </div>

      {/* Pending Stays */}
      {uniqueStays.length > 0 ? (
        <>
          <div className="space-y-4">
            {uniqueStays.map((stay, index) => (
              <PendingStayCard
                key={`${stay._id}-${currentPage}-${index}`}
                id={stay._id}
                title={stay.title}
                location={stay.location}
                price={stay.price}
                frequency={stay.frequency}
                imageUrl={stay.imageUrl}
                expiresAt={stay.expiresAt}
                onAccept={handleAccept}
                onRefund={handleRefund}
                disabled={isProcessing}
              />
            ))}
          </div>

          {/* Show More / Collapse Buttons */}
          {totalStays > itemsPerPage && (
            <div className="flex justify-center gap-4 pt-4">
              {hasMore && (
                <Button
                  variant="signup-primary"
                  size="allotease-md"
                  onClick={handleShowMore}
                  disabled={isLoading || isProcessing}
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
                  disabled={isLoading || isProcessing}
                >
                  Collapse
                </Button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No pending confirmations
          </h3>
          <p className="text-gray-500">
            You don't have any stays awaiting confirmation at the moment.
          </p>
        </div>
      )}
    </div>
  );
}