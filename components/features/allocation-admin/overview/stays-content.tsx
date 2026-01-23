"use client";
import React, { useState, useEffect } from "react";
import { StatCard } from "./stat-card";
import { StatCardSkeleton } from "@/components/ui/loading-skeletons/stat-card-skeleton";
import { DataTable, ColumnConfig } from "@/components/ui/data-table";
import { DataTableSkeleton } from "@/components/ui/loading-skeletons/data-table-skeleton";
import { Pagination } from "@/components/ui/pagination";
import { NetworkError } from "@/components/ui/network-error";
import { useTransformedReservations } from "@/hooks/use-reservations";
import { TimeframeValue } from "@/components/ui/timeframe-selector";
import { useProcessedStaysStats } from "@/hooks/use-stays-stats";

interface StaysContentProps {
  timeframe: TimeframeValue;
}

export function StaysContent({ timeframe }: StaysContentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset to page 1 when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Fetch stats data with selected timeframe
  const {
    statsArray,
    isLoading: isStatsLoading,
    hasError: hasStatsError,
    refetch: refetchStats,
  } = useProcessedStaysStats(timeframe);

  // Fetch reservations data with pagination
  const {
    data: reservationsData,
    pagination,
    isLoading: isReservationsLoading,
    isError: hasReservationsError,
    refetch: refetchReservations,
  } = useTransformedReservations({
    page: currentPage,
    limit: itemsPerPage,
  });

  const columns: ColumnConfig[] = [
    { key: "id", label: "Reservation ID", type: "truncated_id" },
    { key: "guest", label: "Guest", type: "guest" },
    { key: "room", label: "Unit", type: "text" },
    { key: "dates", label: "Dates", type: "text" },
    { key: "status", label: "Status", type: "status" },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
  };

  // Render stats section based on loading/error states
  const renderStatsSection = () => {
    if (isStatsLoading) {
      return (
        <>
          <div className="lg:hidden -mx-4 px-4">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex-shrink-0 w-[280px] snap-start">
                  <StatCardSkeleton isFirstCard={index === 0} />
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <StatCardSkeleton key={index} isFirstCard={index === 0} />
            ))}
          </div>
        </>
      );
    }

    // Error state
    if (hasStatsError) {
      return (
        <div className="grid grid-cols-1 gap-6">
          <NetworkError message="Unable to load statistics" onRetry={refetchStats} />
        </div>
      );
    }

    // Success state - show stats
    return (
      <>
        <div className="lg:hidden -mx-4 px-4 relative">
          {/* Scroll container */}
          <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2">
            {statsArray.map((stat, index) => (
              <div key={index} className="flex-shrink-0 w-[280px] snap-start">
                <StatCard
                  title={stat.title}
                  value={stat.value}
                  percentage={stat.percentage === "--" ? undefined : stat.percentage}
                  isFirstCard={stat.isFirstCard}
                />
              </div>
            ))}
          </div>
          <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>

        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsArray.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              percentage={stat.percentage === "--" ? undefined : stat.percentage}
              isFirstCard={stat.isFirstCard}
            />
          ))}
        </div>
      </>
    );
  };

  // Render reservations table section
  const renderReservationsSection = () => {
    // Loading state
    if (isReservationsLoading) {
      return (
        <DataTableSkeleton
          title="Recent reservations"
          columns={["Reservation ID", "Guest", "Space", "Dates", "Status"]}
          rowCount={itemsPerPage}
          showSearch={true}
          showExport={false}
        />
      );
    }

    // Error state
    if (hasReservationsError) {
      return (
        <div className="rounded-xl border border-[rgba(138,174,164,0.20)] bg-[rgba(242,244,247,0.50)] p-6">
          <h3 className="text-[#1F2024] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px] mb-4">
            Recent reservations
          </h3>
          <NetworkError message="Unable to load reservations" onRetry={refetchReservations} />
        </div>
      );
    }

    // Success state
    return (
      <div className="space-y-4">
        <DataTable
          title="Recent reservations"
          columns={columns}
          data={reservationsData}
          variant="reservations"
          showSearch={true}
          showExport={false}
          searchPlaceholder="Search by guest name or ID"
          isLoading={isReservationsLoading}
          isEmpty={reservationsData.length === 0}
          hasError={hasReservationsError}
          onRetry={refetchReservations}
        />

        {pagination && !isReservationsLoading && (
          <div className="flex justify-end">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              totalItems={pagination.totalItems}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              disabled={isReservationsLoading}
              showInfo={true}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      {renderStatsSection()}

      {/* Reservations Table Section */}
      {renderReservationsSection()}
    </div>
  );
}