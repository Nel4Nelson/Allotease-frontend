"use client";
import {
  TabConfig,
  TabsWithUrlState,
} from "@/components/ui/tabs-with-url-state";
import { TicketStaysPending } from "./ticket-stays-pending";
import { TicketStaysPast } from "./ticket-stays-past";
import { TicketStaysActive } from "./ticket-stays-active";

interface TicketStaysContentProps {
  className?: string;
}

export function TicketStaysContent({
  className = "",
}: TicketStaysContentProps) {
  // Tabs only for Active and Past - no Pending tab
  const tabs: TabConfig[] = [
    {
      value: "active",
      label: "Active",
      content: <TicketStaysActive />,
    },
    {
      value: "past",
      label: "Past",
      content: <TicketStaysPast />,
    },
  ];

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Pending Stays Section - Always visible at the top */}
      <TicketStaysPending />

      {/* Active and Past Stays Tabs */}
      <div>
        <TabsWithUrlState
          tabs={tabs}
          defaultTab="active"
          basePath="/tickets"
          queryParam="status"
        />
      </div>
    </div>
  );
}
