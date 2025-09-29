"use client";
import React, { useState } from "react";
import { StatCard } from "./stat-card";
import { StatCardSkeleton } from "@/components/ui/loading-skeletons/stat-card-skeleton";
import { DataTable, ColumnConfig } from "@/components/ui/data-table";
import { DataTableSkeleton } from "@/components/ui/loading-skeletons/data-table-skeleton";
import { Pagination } from "@/components/ui/pagination";
import { NetworkError } from "@/components/ui/network-error";
import { Button } from "@/components/ui/button";
import { useProcessedStaysStats } from "@/hooks/use-stays-stats";
import { useTransformedReservations } from "@/hooks/use-reservations";

export function StaysContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch stats data
  const {
    statsArray,
    isLoading: isStatsLoading,
    hasError: hasStatsError,
    isPartialError,
    error: statsError,
    refetchAll: refetchStats,
    isDailySuccess,
    isMonthlySuccess,
  } = useProcessedStaysStats();

  // Fetch reservations data with pagination
  const {
    data: reservationsData,
    pagination,
    isLoading: isReservationsLoading,
    isError: hasReservationsError,
    error: reservationsError,
    refetch: refetchReservations,
  } = useTransformedReservations({ 
    page: currentPage, 
    limit: itemsPerPage 
  });

  const columns: ColumnConfig[] = [
    { key: "id", label: "Reservation ID", type: "truncated_id" },
    { key: "guest", label: "Guest", type: "guest" },
    { key: "room", label: "Room", type: "text" },
    { key: "dates", label: "Dates", type: "text" },
    { key: "status", label: "Status", type: "status" },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRetryAll = async () => {
    await Promise.all([
      refetchStats(),
      refetchReservations()
    ]);
  };

  // Render stats section based on loading/error states
  const renderStatsSection = () => {
    // Complete loading state - show skeletons
    if (isStatsLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <StatCardSkeleton
              key={index}
              isFirstCard={index === 0}
            />
          ))}
        </div>
      );
    }

    // Complete error state - both API calls failed
    if (hasStatsError && !isPartialError) {
      return (
        <div className="grid grid-cols-1 gap-6">
          <NetworkError
            message="Unable to load statistics"
            onRetry={refetchStats}
          />
        </div>
      );
    }

    // Partial error or success state - show stats with fallbacks
    return (
      <div className="space-y-4">
        {/* Partial error notification - when one API call succeeds but the other fails */}
        {isPartialError && (
          <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-yellow-800 text-sm">
                {!isDailySuccess && isMonthlySuccess && "Daily statistics are unavailable"}
                {isDailySuccess && !isMonthlySuccess && "Monthly statistics are unavailable"}
                {!isDailySuccess && !isMonthlySuccess && "Some statistics may be outdated due to connection issues"}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refetchStats}
              className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Stats Grid - shows data with "--" fallbacks for missing data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>
    );
  };

  // Render reservations table section
  const renderReservationsSection = () => {
    // Loading state - show table skeleton
    if (isReservationsLoading) {
      return (
        <DataTableSkeleton
          title="Recent reservations"
          columns={["Reservation ID", "Guest", "Room", "Dates", "Status"]}
          rowCount={itemsPerPage}
          showSearch={true}
          showExport={true}
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
          <NetworkError
            message="Unable to load reservations"
            onRetry={refetchReservations}
          />
        </div>
      );
    }

    // Success state - show data with proper empty states
    return (
      <div className="space-y-4">
        {/* Reservations Table */}
        <DataTable
          title="Recent reservations"
          columns={columns}
          data={reservationsData}
          variant="reservations"
          showSearch={true}
          showExport={true}
          searchPlaceholder="Search by guest name or ID"
          onExport={() => {
            console.log("Export reservations:", reservationsData);
            // TODO: Implement actual export functionality
          }}
          isLoading={isReservationsLoading}
          isEmpty={reservationsData.length === 0}
          hasError={hasReservationsError}
          onRetry={refetchReservations}
        />

        {/* Pagination - only show if we have data and pagination info */}
        {pagination && pagination.totalPages > 1 && !isReservationsLoading && (
          <div className="flex justify-end">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              totalItems={pagination.totalItems}
              itemsPerPage={itemsPerPage}
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
      {/* Stats Section with optimized 2-call approach */}
      {renderStatsSection()}

      {/* Reservations Table Section */}
      {renderReservationsSection()}
    </div>
  );
}