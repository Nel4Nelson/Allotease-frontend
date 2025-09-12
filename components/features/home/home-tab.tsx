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
      label: "Spaces",
      content: <StaysContent />,
    },
    {
      value: "events",
      label: "Events",
      content: <EventsContent />,
    },
  ];

  return (
    <TabsWithUrlState
      tabs={tabs}
      defaultTab="stays"
      basePath="/"
      className={className}
    />
  );
}
