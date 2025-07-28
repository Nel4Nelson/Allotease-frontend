"use client";
import { TabConfig, TabsWithUrlState } from "@/components/ui/tabs-with-url-state";
import { StaysForm } from "./stays-form";
import { EventsForm } from "./events-form";

interface CreateTabsProps {
  className?: string;
}

export function CreateTabs({ className = "" }: CreateTabsProps) {
  const tabs: TabConfig[] = [
    {
      value: "stays",
      label: "Stays",
      content: <StaysForm />
    },
    {
      value: "events", 
      label: "Events",
      content: <EventsForm />
    },
    {
      value: "car-parks",
      label: "Car parks",
      content: (
        <div>
          <h2 className="text-xl font-semibold mb-4">Create New Car Park</h2>
          <p className="text-gray-600">Car park - coming soon!</p>
        </div>
      )
    }
  ];

  return (
    <TabsWithUrlState
      tabs={tabs}
      defaultTab="events"
      basePath="/allocation-admin/create"
      className={className}
    />
  );
}