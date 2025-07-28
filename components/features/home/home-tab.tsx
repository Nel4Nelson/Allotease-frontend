"use client";
import {
  TabConfig,
  TabsWithUrlState,
} from "@/components/ui/tabs-with-url-state";
import { EventsContent } from "./events-content";
import { StaysContent } from "./stays-content";

interface HomeTabsProps {
  className?: string;
}

export function HomeTabs({ className = "" }: HomeTabsProps) {
  const tabs: TabConfig[] = [
    {
      value: "stays",
      label: "Stays",
      content: <StaysContent />,
    },
    {
      value: "events",
      label: "Events",
      content: <EventsContent />,
    },
    {
      value: "car-parks",
      label: "Car parks",
      content: (
        <div>
          {/* Available parking options content will go here */}
          <h2 className="text-xl font-semibold mb-4">Available Parking</h2>
          <p className="text-gray-600">Car parks content coming soon...</p>
        </div>
      ),
    },
  ];

  return (
    <TabsWithUrlState
      tabs={tabs}
      defaultTab="events"
      basePath="/"
      className={className}
    />
  );
}
