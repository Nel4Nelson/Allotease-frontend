import { ManagementStats } from "@/types";
import { StatCard } from "@/components/features/management/overview/stats-section";

export function transformToStatCards(
  stats: ManagementStats | null
): StatCard[] {
  if (!stats) return [];

  return [
    {
      title: "Total Reservations",
      value: stats.totalReservations?.count ?? 0,
      percentage: `${stats.totalReservations?.growth ?? 0}%`,
      trend: (stats.totalReservations?.growth ?? 0) >= 0 ? "up" : "down",
    },
    {
      title: "Check-ins Today",
      value: stats.checkInsToday?.count ?? 0,
      percentage: `${stats.checkInsToday?.growth ?? 0}%`,
      trend: (stats.checkInsToday?.growth ?? 0) >= 0 ? "up" : "down",
    },
    {
      title: "Available Spaces",
      value: stats.availableSpaces?.count ?? 0,
      percentage: `${stats.availableSpaces?.growth ?? 0}%`,
      trend: (stats.availableSpaces?.growth ?? 0) >= 0 ? "up" : "down",
    },
    {
      title: "Revenue This Month",
      value: stats.revenueThisMonth?.amount ?? 0,
      percentage: `${stats.revenueThisMonth?.growth ?? 0}%`,
      trend: (stats.revenueThisMonth?.growth ?? 0) >= 0 ? "up" : "down",
    },
  ];
}