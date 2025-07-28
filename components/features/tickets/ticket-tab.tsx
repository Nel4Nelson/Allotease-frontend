"use client";
import {
  TabConfig,
  TabsWithUrlState,
} from "@/components/ui/tabs-with-url-state";
import { TicketEventsContent } from "./ticket-events-content";

interface TicketTabsProps {
  className?: string;
}

export function TicketTabs({ className = "" }: TicketTabsProps) {
  const tabs: TabConfig[] = [
    {
      value: "stays",
      label: "Stays",
      content: (
        <div>
          <h2 className="text-xl font-semibold mb-4">Stays</h2>
          <p className="text-gray-600">
            Find tickets about the Stays you are excited to hear...
          </p>
        </div>
      ),
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
