"use client";
import {
  TabConfig,
  TabsWithUrlState,
} from "@/components/ui/tabs-with-url-state";
import { ReservationsStaysContent } from "./reservations-stays-content";
import { ReservationsEventsContent } from "./reservations-events-content";

interface ReservationsTabsProps {
  className?: string;
}

export function ReservationsTabs({ className = "" }: ReservationsTabsProps) {
  const tabs: TabConfig[] = [
    {
      value: "stays",
      label: "Stays",
      content: <ReservationsStaysContent />,
    },
    {
      value: "events",
      label: "Events",
      content: <ReservationsEventsContent />,
    },
  ];

  return (
    <TabsWithUrlState
      tabs={tabs}
      defaultTab="stays"
      basePath="/allocation-admin/dashboard/reservations"
      className={className}
    />
  );
}
