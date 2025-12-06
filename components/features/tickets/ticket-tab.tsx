"use client";
import {
  TabConfig,
  TabsWithUrlState,
} from "@/components/ui/tabs-with-url-state";
import { TicketEventsContent } from "./ticket-events-content";
import { TicketStaysContent } from "./ticket-stays-content";

interface TicketTabsProps {
  className?: string;
}

export function TicketTabs({ className = "" }: TicketTabsProps) {
  const tabs: TabConfig[] = [
    {
      value: "stays",
      label: "Stays",
      content: <TicketStaysContent />,
    },
    {
      value: "events",
      label: "Events",
      content: <TicketEventsContent />,
    },
  ];

  return (
    <TabsWithUrlState
      tabs={tabs}
      defaultTab="stays"
      basePath="/tickets"
      className={className}
    />
  );
}
