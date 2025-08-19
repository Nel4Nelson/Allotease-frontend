"use client";

import {
  StaysTicketService,
  StayBooking,
} from "@/services/stays-ticket-service";

interface StayCardProps {
  stay: StayBooking;
}

// Stay Card Component (reusable for active and past)
export function StayCard({ stay }: StayCardProps) {
  // Format location
  const location = StaysTicketService.formatLocation(stay.location);

  // Format dates
  const dateRange = StaysTicketService.formatStayDates(
    stay.checkInDate,
    stay.checkOutDate
  );

  // Get status badge info
  const statusBadge = StaysTicketService.getStatusBadgeInfo(stay.status);

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      {/* Stay Image */}
      <div
        className="w-32 h-24 flex-shrink-0 rounded-lg bg-cover bg-center bg-gray-200"
        style={{
          backgroundImage: stay.stayImages[0]
            ? `url(${stay.stayImages[0]})`
            : undefined,
        }}
      />

      {/* Stay Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {stay.stayTitle}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{location}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>{dateRange}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${statusBadge.color}`}
              >
                {statusBadge.text}
              </span>
              <span className="text-sm text-gray-500">
                {stay.numberOfRentedUnits} unit
                {stay.numberOfRentedUnits !== 1 ? "s" : ""} • {stay.frequency}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-lg font-semibold text-gray-900">N----</span>
            {stay.stayType && (
              <span className="text-xs text-gray-500 mt-1">
                {stay.stayType}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
