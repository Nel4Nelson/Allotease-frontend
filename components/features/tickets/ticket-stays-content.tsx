/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { TicketsSectionHeader } from "./tickets-section-header";
import { TicketStayCard } from "./ticket-stay-card";
import { ActiveStayCard } from "./active-stay-card";
import { ShowMoreSection } from "./show-more-section";
import { ConfirmStayModal } from "@/components/ui/modals/confirm-stay-modal";
import {
  usePendingStays,
  useConfirmStay,
  useStayUnits,
  useLoadMoreStayUnits,
  useInvalidateStayUnits,
} from "@/hooks/use-bookings";
import { BookingService, PendingStayBooking, StayUnitBooking } from "@/services/booking-service";
import { useIsOnline } from "@/hooks/use-network-status";
import { NetworkError, OfflineState } from "@/components/ui/network-error";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { bookingKeys } from "@/hooks/use-bookings";
import { ActiveStayCardSkeletonGrid } from "@/components/ui/loading-skeletons/active-stay-card-skeleton";

export function TicketStaysContent() {
  const router = useRouter();
  const isOnline = useIsOnline();
  const queryClient = useQueryClient();

  // State for pending stays (Unconfirmed section)
  const [currentPage, setCurrentPage] = useState(1);
  const [allPendingStays, setAllPendingStays] = useState<PendingStayBooking[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const loadingMoreRef = useRef(false);

  // State for confirm modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStay, setSelectedStay] = useState<PendingStayBooking | null>(null);

  // State for stay units (Your accommodations section)
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "expired">("all");
  const [stayUnitsPage, setStayUnitsPage] = useState(1);
  const [allStayUnits, setAllStayUnits] = useState<StayUnitBooking[]>([]);
  const [isLoadingMoreUnits, setIsLoadingMoreUnits] = useState(false);
  const [hasMoreUnits, setHasMoreUnits] = useState(true);
  const loadingMoreUnitsRef = useRef(false);
  const { removeQueries: removeStayUnitsQueries } = useInvalidateStayUnits();

  // Use TanStack Query for fetching pending stays
  const { data, isLoading, isError, refetch } = usePendingStays({
    page: currentPage,
    limit: 3,
  });

  // Use confirm stay mutation
  const confirmStayMutation = useConfirmStay();

  // Use TanStack Query for fetching stay units
  const {
    data: stayUnitsData,
    isLoading: isLoadingUnits,
    isError: isErrorUnits,
    refetch: refetchUnits,
  } = useStayUnits({
    status: selectedStatus,
    page: stayUnitsPage,
    limit: 3,
  });

  // Use load more mutation for stay units
  const loadMoreUnitsMutation = useLoadMoreStayUnits();

  // Handle initial load and subsequent loads for pending stays
  useEffect(() => {
    if (data?.data?.items) {
      if (currentPage === 1) {
        setAllPendingStays(data.data.items);
      } else {
        setAllPendingStays((prev) => {
          const existingIds = new Set(prev.map((s) => s._id));
          const newItems = data.data.items.filter(
            (item) => !existingIds.has(item._id)
          );
          return [...prev, ...newItems];
        });
      }

      setHasMoreData(data.data.hasNextPage);

      if (currentPage > 1) {
        setIsLoadingMore(false);
        loadingMoreRef.current = false;
      }
    }
  }, [data, currentPage]);

  // Handle initial load and subsequent loads for stay units
  useEffect(() => {
    if (stayUnitsData?.data?.items) {
      if (stayUnitsPage === 1) {
        setAllStayUnits(stayUnitsData.data.items);
      } else {
        setAllStayUnits((prev) => {
          const existingIds = new Set(prev.map((s) => s._id));
          const newItems = stayUnitsData.data.items.filter(
            (item) => !existingIds.has(item._id)
          );
          return [...prev, ...newItems];
        });
      }

      setHasMoreUnits(stayUnitsData.data.hasNextPage);

      if (stayUnitsPage > 1) {
        setIsLoadingMoreUnits(false);
        loadingMoreUnitsRef.current = false;
      }
    }
  }, [stayUnitsData, stayUnitsPage]);

  // Refetch when coming back online
  useEffect(() => {
    if (isOnline && isError) {
      refetch();
    }
    if (isOnline && isErrorUnits) {
      refetchUnits();
    }
  }, [isOnline, isError, isErrorUnits, refetch, refetchUnits]);

  // Handlers for pending stays (Unconfirmed section)
  const handleShowMore = () => {
    if (loadingMoreRef.current || isLoadingMore || !hasMoreData || !isOnline) {
      return;
    }

    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    setCurrentPage((prev) => prev + 1);
  };

  const handleCollapse = () => {
    setCurrentPage(1);
    setAllPendingStays([]);
    setIsLoadingMore(false);
    setHasMoreData(true);
    loadingMoreRef.current = false;
  };

  // Handlers for stay units (Your accommodations section)
  const handleStatusChange = (newStatus: "all" | "active" | "expired") => {
    setSelectedStatus(newStatus);
    setStayUnitsPage(1);
    setAllStayUnits([]);
    setIsLoadingMoreUnits(false);
    setHasMoreUnits(true);
    loadingMoreUnitsRef.current = false;
    removeStayUnitsQueries();
  };

  const handleShowMoreUnits = async () => {
    if (
      loadingMoreUnitsRef.current ||
      isLoadingMoreUnits ||
      !hasMoreUnits ||
      !isOnline
    ) {
      return;
    }

    const nextPage = stayUnitsPage + 1;

    try {
      loadingMoreUnitsRef.current = true;
      setIsLoadingMoreUnits(true);

      await loadMoreUnitsMutation.mutateAsync({
        status: selectedStatus,
        page: nextPage,
        limit: 3,
      });

      setStayUnitsPage(nextPage);
    } catch (error) {
      console.error("Failed to load more stay units:", error);
      loadingMoreUnitsRef.current = false;
      setIsLoadingMoreUnits(false);
    }
  };

  const handleCollapseUnits = () => {
    if (stayUnitsPage > 1) {
      const newPage = stayUnitsPage - 1;
      const itemsPerPage = 3;

      const firstPageData = queryClient.getQueryData<any>(
        bookingKeys.stayUnitsList({
          status: selectedStatus,
          page: 1,
          limit: 3,
        })
      );

      if (firstPageData) {
        const itemsToKeep = newPage * itemsPerPage;
        const newItems = firstPageData.data.items.slice(0, itemsToKeep);

        const updatedData = {
          ...firstPageData,
          data: {
            ...firstPageData.data,
            items: newItems,
            hasNextPage: newPage < firstPageData.data.totalPages,
          },
        };

        queryClient.setQueryData(
          bookingKeys.stayUnitsList({
            status: selectedStatus,
            page: 1,
            limit: 3,
          }),
          updatedData
        );

        setStayUnitsPage(newPage);
      }
    }
  };

  const handleReview = (stayId: string) => {
    console.log("Review stay:", stayId);
    // TODO: Open review modal
  };

  // Handle Accept button click - Open modal
  const handleAccept = (stayId: string) => {
    const stay = allPendingStays.find(
      (s) => s._id === stayId || s.bookingId === stayId
    );

    if (!stay) {
      toast.error("Stay not found");
      return;
    }

    if (!isOnline) {
      toast.error("You're offline. Please check your connection.");
      return;
    }

    setSelectedStay(stay);
    setShowConfirmModal(true);
  };

  const handleConfirmStay = async () => {
    if (!selectedStay) return;

    try {
      await confirmStayMutation.mutateAsync({
        bookingId: selectedStay.bookingId,
        confirm: true,
      });

      setShowConfirmModal(false);
      setSelectedStay(null);

      toast.success("Stay confirmed successfully!");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to confirm stay";
      toast.error(errorMessage);
    }
  };

  const handleCloseModal = () => {
    if (confirmStayMutation.isPending) return;

    setShowConfirmModal(false);
    setSelectedStay(null);
  };

  const handleRefund = (stayId: string) => {
    console.log("Refund stay:", stayId);
  };

  const handleReset = () => {
    setCurrentPage(1);
    setAllPendingStays([]);
    setIsLoadingMore(false);
    setHasMoreData(true);
    loadingMoreRef.current = false;
  };

  const handleResetUnits = () => {
    setStayUnitsPage(1);
    setAllStayUnits([]);
    setIsLoadingMoreUnits(false);
    setHasMoreUnits(true);
    loadingMoreUnitsRef.current = false;
  };

  const mappedPendingStays = allPendingStays.map((booking) =>
    BookingService.mapToStayCard(booking)
  );

  // Map stay units to active stay card format
  const mappedStayUnits = allStayUnits.map((booking) =>
    BookingService.mapToActiveStayCard(booking)
  );

  return (
    <>
      <div className="space-y-12">
        {/* Pending Stays Section (Unconfirmed) */}
        <div className="space-y-6">
          <TicketsSectionHeader
            title="Unconfirmed"
            subtitle="You have a small window to confirm that you like the place."
          />

          {!isOnline && allPendingStays.length === 0 ? (
            <OfflineState />
          ) : isError && !isLoading && allPendingStays.length === 0 ? (
            <NetworkError
              message="Failed to load pending stays"
              onRetry={() => {
                handleReset();
                refetch();
              }}
            />
          ) : isLoading && allPendingStays.length === 0 ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="w-full h-[200px] bg-gray-200 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : !isLoading && !isError && allPendingStays.length === 0 ? (
            <div className="flex flex-col items-center gap-4 p-8 bg-gray-50 rounded-2xl text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  No Pending Bookings
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  You don't have any stays awaiting confirmation
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="px-6 py-2 bg-[var(--feature-accent-orange)] hover:bg-[#E54A00] text-white rounded-full font-semibold transition-colors"
                >
                  Browse Stays
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {mappedPendingStays.map((stay, index) => (
                  <TicketStayCard
                    key={`${stay.id}-${index}`}
                    title={stay.title}
                    location={stay.location}
                    imageUrl={stay.imageUrl}
                    price={stay.price}
                    frequency={stay.frequency}
                    statusText={stay.statusText}
                    onAccept={() => handleAccept(stay.id)}
                    onRefund={() => handleRefund(stay.id)}
                    disabled={false}
                  />
                ))}
              </div>

              <ShowMoreSection
                showMoreButton={hasMoreData}
                showCollapseButton={currentPage > 1}
                onShowMore={handleShowMore}
                onCollapse={handleCollapse}
                isLoading={isLoadingMore}
                loadingText="Loading more stays..."
                showMoreText="Show more"
                statusInfo={{
                  currentCount: mappedPendingStays.length,
                  totalCount: data?.data?.totalCount || 0,
                  currentPage: currentPage,
                  totalPages: data?.data?.totalPages || 1,
                }}
              />
            </>
          )}
        </div>

        {/* Stay Units Section (Your accommodations) */}
        <div className="space-y-6">
          <TicketsSectionHeader
            title="Your accommodations"
            subtitle="Find details about your reservations here."
            showStatusFilter={true}
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
          />

          {!isOnline && allStayUnits.length === 0 ? (
            <OfflineState />
          ) : isErrorUnits && !isLoadingUnits && allStayUnits.length === 0 ? (
            <NetworkError
              message="Failed to load your accommodations"
              onRetry={() => {
                handleResetUnits();
                refetchUnits();
              }}
            />
          ) : isLoadingUnits && allStayUnits.length === 0 ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <ActiveStayCardSkeletonGrid count={3} />
                </div>
              ))}
            </div>
          ) : !isLoadingUnits && !isErrorUnits && allStayUnits.length === 0 ? (
            <div className="flex flex-col items-center gap-4 p-8 bg-gray-50 rounded-2xl text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  No Accommodations Found
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {selectedStatus === "active"
                    ? "You don't have any active bookings"
                    : selectedStatus === "expired"
                      ? "You don't have any expired bookings"
                      : "You don't have any bookings yet"}
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="px-6 py-2 bg-[var(--feature-accent-orange)] hover:bg-[#E54A00] text-white rounded-full font-semibold transition-colors"
                >
                  Browse Stays
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {mappedStayUnits.map((stay, index) => (
                  <ActiveStayCard
                    key={`${stay.id}-${index}`}
                    title={stay.title}
                    location={stay.location}
                    imageUrl={stay.imageUrl}
                    images={stay.images}
                    price={stay.price}
                    frequency={stay.frequency}
                    status={stay.status}
                    checkInDate={stay.checkInDate}
                    checkOutDate={stay.checkOutDate}
                    onReview={() => handleReview(stay.id)}
                  />
                ))}
              </div>

              <ShowMoreSection
                showMoreButton={hasMoreUnits}
                showCollapseButton={stayUnitsPage > 1}
                onShowMore={handleShowMoreUnits}
                onCollapse={handleCollapseUnits}
                isLoading={isLoadingMoreUnits}
                loadingText="Loading more accommodations..."
                showMoreText="Show more"
                statusInfo={{
                  currentCount: mappedStayUnits.length,
                  totalCount: stayUnitsData?.data?.totalCount || 0,
                  currentPage: stayUnitsPage,
                  totalPages: stayUnitsData?.data?.totalPages || 1,
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Confirm Stay Modal */}
      <ConfirmStayModal
        isOpen={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmStay}
        stayTitle={selectedStay?.stayTitle || ""}
        isLoading={confirmStayMutation.isPending}
      />
    </>
  );
}