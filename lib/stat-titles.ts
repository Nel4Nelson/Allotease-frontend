import { TimeFrame } from "@/services/stays-stats-service";

interface StatTitles {
  totalReservation: string;
  checkins: string;
  availableSpaces: string;
  revenue: string;
}

/**
 * Get dynamic stat titles based on selected timeframe
 */
export function getStatTitles(timeframe: TimeFrame): StatTitles {
  switch (timeframe) {
    case "day":
      return {
        totalReservation: "Total reservation",
        checkins: "Check-ins today",
        availableSpaces: "Available spaces",
        revenue: "Revenue today",
      };
    case "week":
      return {
        totalReservation: "Total reservation",
        checkins: "Check-ins this week",
        availableSpaces: "Available spaces",
        revenue: "Revenue this week",
      };
    case "month":
      return {
        totalReservation: "Total reservation",
        checkins: "Check-ins this month",
        availableSpaces: "Available spaces",
        revenue: "Revenue this month",
      };
    default:
      return {
        totalReservation: "Total reservation",
        checkins: "Check-ins today",
        availableSpaces: "Available spaces",
        revenue: "Revenue today",
      };
  }
}