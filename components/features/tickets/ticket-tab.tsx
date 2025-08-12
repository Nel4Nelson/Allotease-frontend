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
    {
      value: "car-parks",
      label: "Car parks",
      content: (
        <div>
          <h2 className="text-xl font-semibold mb-4">Car Parks</h2>
          <p className="text-gray-600">
            Car parks tickets content coming soon...
          </p>
        </div>
      ),
    },
  ];

  return (
    <TabsWithUrlState
      tabs={tabs}
      defaultTab="events"
      basePath="/tickets"
      className={className}
    />
  );
}
