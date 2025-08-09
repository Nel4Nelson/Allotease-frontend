"use client";
import {
  TabConfig,
  TabsWithUrlState,
} from "@/components/ui/tabs-with-url-state";
import { TicketStaysPending } from "./ticket-stays-pending";

interface TicketStaysContentProps {
  className?: string;
}

export function TicketStaysContent({ className = "" }: TicketStaysContentProps) {
  const tabs: TabConfig[] = [
    {
      value: "pending",
      label: "Pending",
      content: <TicketStaysPending />,
    },
    {
      value: "active",
      label: "Active",
      content: (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No active stays
          </h3>
          <p className="text-gray-500">
            Your confirmed and upcoming stays will appear here.
          </p>
        </div>
      ),
    },
    {
      value: "past",
      label: "Past",
      content: (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No past stays
          </h3>
          <p className="text-gray-500">
            Your completed stays and booking history will appear here.
          </p>
        </div>
      ),
    },
  ];

  return (
    <TabsWithUrlState
      tabs={tabs}
      defaultTab="pending"
      basePath="/tickets"
      queryParam="status"
      className={className}
    />
  );
}