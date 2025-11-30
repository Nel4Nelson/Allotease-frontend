"use client";
import {
    TabConfig,
    TabsWithUrlState,
} from "@/components/ui/tabs-with-url-state";
import { AllocationAdminStaysContent } from "./allocation-admin-stays-content";
import { AllocationAdminEventsContent } from "./allocation-admin-events-content";

interface AllocationAdminTabsProps {
    allocatorId: string;
    className?: string;
}

export function AllocationAdminTabs({ allocatorId, className = "" }: AllocationAdminTabsProps) {
    const tabs: TabConfig[] = [
    {
      value: "stays",
      label: "Spaces",
      content: <AllocationAdminStaysContent allocatorId={allocatorId} />,
    },
    {
      value: "events",
      label: "Events",
      content: <AllocationAdminEventsContent allocatorId={allocatorId} />,
    },
  ];

    return (
        <TabsWithUrlState
            tabs={tabs}
            defaultTab="stays"
            basePath={`/all-allocation-admins/${allocatorId}`}
            className={className}
        />
    );
}