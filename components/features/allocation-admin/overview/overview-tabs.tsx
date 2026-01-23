"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  TabConfig,
  TabsWithUrlState,
} from "@/components/ui/tabs-with-url-state";

import { StaysContent } from "./stays-content";
import { EventsContent } from "./events-content";
import { TimeframeSelector, TimeframeValue } from "@/components/ui/timeframe-selector";

interface OverviewTabsProps {
  className?: string;
}

export function OverviewTabs({ className = "mt-16" }: OverviewTabsProps) {
  const searchParams = useSearchParams();
  
  // Independent timeframe state for each tab
  const [staysTimeframe, setStaysTimeframe] = useState<TimeframeValue>("day");
  const [eventsTimeframe, setEventsTimeframe] = useState<TimeframeValue>("day");
  
  // Get current active tab from URL (uses "type" query param)
  const activeTab = searchParams?.get("type") || "stays";

  // Determine which timeframe to show based on active tab
  const currentTimeframe = activeTab === "stays" ? staysTimeframe : eventsTimeframe;
  
  // Handle timeframe change
  const handleTimeframeChange = (value: TimeframeValue) => {
    if (activeTab === "stays") {
      setStaysTimeframe(value);
    } else {
      setEventsTimeframe(value);
    }
  };

  // Tab configurations with timeframe props
  const tabs: TabConfig[] = [
    {
      value: "stays",
      label: "Stays",
      content: <StaysContent timeframe={staysTimeframe} />,
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
      renderHeader={(tabsList) => (
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
          
          {/* Tabs on the left - will naturally shrink if needed */}
          <div className="flex-shrink min-w-0">
            {tabsList}
          </div>
          
          {/* Timeframe Selector on the right - won't shrink below its content */}
          <div className="flex-shrink-0">
            <TimeframeSelector
              value={currentTimeframe}
              onChange={handleTimeframeChange}
            />
          </div>
        </div>
      )}
    />
  );
}