// utils/stay-reservation-transformer.ts

import { ReservationItem } from "@/types";

export interface TransformedReservation {
  id: string | undefined;
  type?: "event" | "stay" | "car-park";
  guestName?: string;
  roomType?: string;
  dates: string; // This is now a formatted string
  status: "Pending" | "Confirmed" | "Cancelled"; // Capitalized
}

/**
 * Transforms API reservation data to match component expectations
 */
export function transformStayReservationData(
  apiReservations: ReservationItem[]
): TransformedReservation[] {
  return apiReservations.map((reservation) => ({
    id: reservation.id,
    guestName: reservation.guestName,
    roomType: reservation.roomType || reservation.serviceName, // Use roomType if available, fallback to serviceName
    dates: formatDateRange(reservation.dates.start, reservation.dates.end), // Now returns string
    status: capitalizeStatus(reservation.status),
  }));
}

/**
 * Formats date range from separate start/end dates
 */
export function formatDateRange(start: string, end: string): string {
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const formatOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year:
        startDate.getFullYear() !== endDate.getFullYear()
          ? "numeric"
          : undefined,
    };

    const startFormatted = startDate.toLocaleDateString("en-US", formatOptions);
    const endFormatted = endDate.toLocaleDateString("en-US", formatOptions);

    return `${startFormatted} - ${endFormatted}`;
  } catch (error) {
    console.warn("Error formatting date range:", error);
    return `${start} - ${end}`; // Fallback to original strings
  }
}

/**
 * Capitalizes the first letter of status
 */
export function capitalizeStatus(
  status: ReservationItem["status"]
): TransformedReservation["status"] {
  const statusMap = {
    pending: "Pending" as const,
    confirmed: "Confirmed" as const,
    cancelled: "Cancelled" as const,
    // expired: "expired" as const,
  };

  return statusMap[status] || "Pending";
}
