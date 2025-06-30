"use client";
import React, { useState } from "react";
import { TicketFilters } from "./ticket-filters";
import { TicketGrid } from "./ticket-grid";
import { useTickets } from "@/hooks/use-tickets";

export function TicketsSection() {
  const { tickets, isLoading, filters, updateFilters } = useTickets();
  const [showMore, setShowMore] = useState(false);

  const initialVisibleCount = 1;
  const extraVisibleCount = 3;

  const visibleTickets = showMore
    ? tickets
    : tickets.slice(0, initialVisibleCount);

  const pastTickets = tickets.filter((ticket) => ticket.status === "past");
  const extraTickets = showMore ? pastTickets.slice(0, extraVisibleCount) : [];

  const handleToggleMore = () => {
    setShowMore((prev) => !prev);
  };

  return (
    <div className="space-y-6">
      <TicketFilters activeFilter={filters} onFilterChange={updateFilters} />

      {/* Current/Upcoming Tickets */}
      <div>
        <TicketGrid tickets={visibleTickets} isLoading={isLoading} />

        {/* Show More Button */}
        {tickets.length > initialVisibleCount && (
          <div className="text-center mt-6 hidden md:block">
            <button
              onClick={handleToggleMore}
              className="px-6 py-2 bg-[#F2F4F799] text-[#FF5B00] rounded-full font-medium hover:bg-[#F2F4F7] transition-colors"
            >
              {showMore ? "Show Less" : "See More"}
            </button>
          </div>
        )}
      </div>

      {/* Past Events Section (when expanded) */}
      {showMore && pastTickets.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <div className="mb-4">
            <h2 className="text-[#1F2024] font-bold text-lg md:text-2xl mb-2">
              Past{" "}
              {filters.type === "all"
                ? "Bookings"
                : filters.type === "event"
                ? "Events"
                : filters.type === "stay"
                ? "Stays"
                : "Parking"}
            </h2>
            <p className="text-[#71727A] text-sm">
              Your previous bookings and completed{" "}
              {filters.type === "all"
                ? "services"
                : filters.type.replace("-", " ")}
              .
            </p>
          </div>

          <TicketGrid tickets={extraTickets} isLoading={false} />
        </div>
      )}
    </div>
  );
}
