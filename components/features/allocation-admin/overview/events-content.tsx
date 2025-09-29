/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { StatCard } from "./stat-card";
import { DataTable, ColumnConfig } from "@/components/ui/data-table";
import { DataTableSkeleton } from "@/components/ui/loading-skeletons/data-table-skeleton";
import { Pagination } from "@/components/ui/pagination";
import { NetworkError } from "@/components/ui/network-error";
import { ReservationDetailsModal } from "@/components/ui/modals/reservation-details-modal";
import { useTransformedEventReservations } from "@/hooks/use-event-reservations";
import { EventReservation } from "@/services/event-reservations-service";

export function EventsContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReservation, setSelectedReservation] = useState<EventReservation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  // Dummy stats data (will be replaced with real API later)
  const eventsStats = [
    { title: "Total events", value: "42", percentage: "+8%" },
    { title: "Active events", value: "12", percentage: "+15%" },
    { title: "Tickets sold", value: "1,247", percentage: "+22%" },
    { title: "Event revenue", value: "N2,150,000", percentage: "+18%" },
  ];

  // Fetch event reservations data with pagination
  const {
    data: eventsData,
    pagination,
    isLoading: isEventsLoading,
    isError: hasEventsError,
    refetch: refetchEvents,
  } = useTransformedEventReservations({
    page: currentPage,
    limit: itemsPerPage,
  });

  const columns: ColumnConfig[] = [
    { key: "id", label: "Reservation ID", type: "truncated_id" },
    { key: "attendee", label: "Attendee", type: "guest" },
    { key: "tickets", label: "Tickets", type: "tickets" },
    { key: "dates", label: "Dates", type: "text" },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowClick = (row: any) => {
    // Find the full reservation data
    const fullReservation = eventsData.find((item) => item.id === row.id);
    if (fullReservation?.fullReservation) {
      setSelectedReservation(fullReservation.fullReservation);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReservation(null);
  };

  // Render events table section
  const renderEventsSection = () => {
    // Loading state - show table skeleton
    if (isEventsLoading) {
      return (
        <DataTableSkeleton
          title="Recent reservations"
          columns={["Reservation ID", "Attendee", "Tickets", "Dates"]}
          rowCount={itemsPerPage}
          showSearch={true}
          showExport={true}
        />
      );
    }

    // Error state
    if (hasEventsError) {
      return (
        <div className="rounded-xl border border-[rgba(138,174,164,0.20)] bg-[rgba(242,244,247,0.50)] p-6">
          <h3 className="text-[#1F2024] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px] mb-4">
            Recent reservations
          </h3>
          <NetworkError
            message="Unable to load event reservations"
            onRetry={refetchEvents}
          />
        </div>
      );
    }

    // Success state - show data with proper empty states
    return (
      <div className="space-y-4">
        {/* Events Table */}
        <DataTable
          title="Recent reservations"
          columns={columns}
          data={eventsData}
          variant="events"
          showSearch={true}
          showExport={true}
          searchPlaceholder="Search by attendee name or ID"
          onExport={() => {
            console.log("Export events:", eventsData);
            // TODO: Implement actual export functionality
          }}
          isLoading={isEventsLoading}
          isEmpty={eventsData.length === 0}
          hasError={hasEventsError}
          onRetry={refetchEvents}
          onRowClick={handleRowClick}
        />

        {/* Pagination - only show if we have data and pagination info */}
        {pagination && pagination.totalPages > 1 && !isEventsLoading && (
          <div className="flex justify-end">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              totalItems={pagination.totalItems}
              itemsPerPage={itemsPerPage}
              disabled={isEventsLoading}
              showInfo={true}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Section - Using dummy data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {eventsStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            percentage={stat.percentage}
            isFirstCard={index === 0}
          />
        ))}
      </div>

      {/* Events Table Section */}
      {renderEventsSection()}

      {/* Reservation Details Modal */}
      <ReservationDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        reservation={selectedReservation}
      />
    </div>
  );
}