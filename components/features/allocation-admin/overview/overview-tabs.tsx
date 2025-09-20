"use client";
import {
  TabConfig,
  TabsWithUrlState,
} from "@/components/ui/tabs-with-url-state";
import { StaysContent } from "./stays-content";
import { EventsContent } from "./events-content";

interface OverviewTabsProps {
  className?: string;
}

export function OverviewTabs({ className = "mt-16" }: OverviewTabsProps) {
  const tabs: TabConfig[] = [
    {
      value: "stays",
      label: "Stays",
      content: <StaysContent />,
    },
    {
      value: "events",
      label: "Event",
      content: <EventsContent />,
    },
  ];

  return (
    <TabsWithUrlState
      tabs={tabs}
      defaultTab="stays"
      basePath="/allocation-admin/dashboard/overview"
      className={className}
    />
  );
}
