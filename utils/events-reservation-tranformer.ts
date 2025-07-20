// utils/event-reservation-transformer.ts

// Define the API response structure (update based on your actual API)
export interface EventReservationItem {
  id?: string;
  guestName?: string; // or attendeeName
  serviceName?: string;
  ticketCount?: number;
  dates?: {
    start: string;
    end: string;
  };
  date?: string; // if single date
  status?: "pending" | "confirmed" | "cancelled";
  amount?: number;
  currency?: string;
  guestContact?: string;
}

// Define the transformed structure for your component
export interface TransformedEventReservation {
  id: string;
  attendee: string;
  ticketCount: number;
  date: string;
}

/**
 * Transforms API event reservation data to match component expectations
 */
export function transformEventReservationData(
  apiReservations: EventReservationItem[]
): TransformedEventReservation[] {
  return apiReservations
    .filter(
      (reservation): reservation is EventReservationItem & { id: string } =>
        Boolean(reservation.id)
    )
    .map((reservation) => ({
      id: reservation.id,
      attendee: reservation.guestName || "Unknown Attendee",
      ticketCount: reservation.ticketCount || 1,
      date: formatEventDate(reservation),
    }));
}

/**
 * Formats event date - handles both single date and date range
 */
function formatEventDate(reservation: EventReservationItem): string {
  try {
    // If there's a single date field
    if (reservation.date) {
      const date = new Date(reservation.date);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    // If there's a date range, use start date
    if (reservation.dates?.start) {
      const date = new Date(reservation.dates.start);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    return "No date";
  } catch (error) {
    console.warn("Error formatting event date:", error);
    return "Invalid date";
  }
}
