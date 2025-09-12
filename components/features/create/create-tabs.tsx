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
      label: "Spaces",
      content: <StaysForm />
    },
    {
      value: "events", 
      label: "Events",
      content: <EventsForm />
    },
  ];

  return (
    <TabsWithUrlState
      tabs={tabs}
      defaultTab="stays"
      basePath="/allocation-admin/create"
      className={className}
    />
  );
}