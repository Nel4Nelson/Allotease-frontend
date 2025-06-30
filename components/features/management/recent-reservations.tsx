"use client";
import React from "react";
import { RecentReservationsProps } from "@/types";

function StatusBadge({ status }: { status: string }) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-700 bg-green-100";
      case "pending":
        return "text-orange-700 bg-orange-100";
      case "cancelled":
        return "text-red-700 bg-red-100";
      case "completed":
        return "text-blue-700 bg-blue-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
        status
      )}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function RecentReservations({
  reservations,
  isLoading,
  onViewAll,
}: RecentReservationsProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-6">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4 animate-pulse" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center animate-pulse"
            >
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/4" />
                <div className="h-4 bg-gray-300 rounded w-1/2" />
                <div className="h-3 bg-gray-300 rounded w-1/3" />
              </div>
              <div className="h-6 bg-gray-300 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[#1F2024]">
          Recent Reservations
        </h3>
        <button
          onClick={onViewAll}
          className="text-[#FF5B00] hover:text-[#E04E00] text-sm font-medium"
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-xs font-medium text-[#71727A] uppercase tracking-wider py-3">
                Reservation ID
              </th>
              <th className="text-left text-xs font-medium text-[#71727A] uppercase tracking-wider py-3">
                Guest
              </th>
              <th className="text-left text-xs font-medium text-[#71727A] uppercase tracking-wider py-3">
                Service
              </th>
              <th className="text-left text-xs font-medium text-[#71727A] uppercase tracking-wider py-3">
                Dates
              </th>
              <th className="text-left text-xs font-medium text-[#71727A] uppercase tracking-wider py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reservations.slice(0, 5).map((reservation) => (
              <tr key={reservation.id} className="hover:bg-gray-50">
                <td className="py-4 text-sm font-medium text-[#1F2024]">
                  {reservation.id}
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#FF5B00] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {reservation.guestName.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-[#1F2024]">
                      {reservation.guestName}
                    </span>
                  </div>
                </td>
                <td className="py-4">
                  <div>
                    <p className="text-sm font-medium text-[#1F2024] truncate max-w-[150px]">
                      {reservation.serviceName}
                    </p>
                    {reservation.roomType && (
                      <p className="text-xs text-[#71727A]">
                        {reservation.roomType}
                      </p>
                    )}
                  </div>
                </td>
                <td className="py-4 text-sm text-[#71727A]">
                  {new Date(reservation.dates.start).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    }
                  )}{" "}
                  -{" "}
                  {new Date(reservation.dates.end).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="py-4">
                  <StatusBadge status={reservation.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
