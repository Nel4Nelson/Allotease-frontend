/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BalanceCard } from "./balance-card";
import { StatsSection } from "./stats-section";
import { StaysReservations } from "./stays-reservations";
import { EventsReservations } from "./events-reservations";

// Mock data - replace with API calls
const mockStats = [
  {
    title: "Total Reservation",
    value: 124,
    percentage: "+12%",
    trend: "up" as const,
  },
  {
    title: "Check-ins today",
    value: 8,
    percentage: "+2%",
    trend: "up" as const,
  },
  {
    title: "Available spaces",
    value: 124,
    percentage: "-3%",
    trend: "down" as const,
  },
  {
    title: "Revenue this month",
    value: 450000,
    percentage: "+12%",
    trend: "up" as const,
  },
];

const mockStaysReservations = [
  {
    id: "RES-1001",
    guest: "Kingsley Promise",
    room: "Classic King Room",
    dates: "May 31 - Jun 1",
    status: "Pending" as const,
  },
  {
    id: "RES-1002",
    guest: "Amaka Onyeka",
    room: "Deluxe Twin Room",
    dates: "June 5 - June 6",
    status: "Confirmed" as const,
  },
  // Add more mock data...
];

const mockEventsReservations = [
  {
    id: "RES-1001",
    attendee: "Kingsley Promise",
    ticketCount: 2,
    date: "2024-01-19 10:00AM",
  },
  {
    id: "RES-1002",
    attendee: "Ada Eze",
    ticketCount: 1,
    date: "2024-02-01 02:30PM",
  },
  // Add more mock data...
];

interface OverviewPageProps {
  onWithdraw?: () => void;
}

export function OverviewPage({ onWithdraw }: OverviewPageProps) {
  const [activeTab, setActiveTab] = useState("stays");

  const handleSearch = (value: string) => {
    console.log("Searching:", value);
    // TODO: Implement search functionality
  };

  const handleSort = (value: string) => {
    console.log("Sorting by:", value);
    // TODO: Implement sort functionality
  };

  const handleExport = () => {
    console.log("Exporting data...");
    // TODO: Implement export functionality
  };

  return (
    <div className="space-y-6">
      {/* Balance Card with Withdrawal */}
      <BalanceCard balance={2150500} onWithdraw={onWithdraw} />

      {/* Stats Section */}
      <StatsSection stats={mockStats} />

      {/* Reservations Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
          <TabsTrigger value="stays">Stays</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="parking">Car Parks</TabsTrigger>
        </TabsList>

        <TabsContent value="stays" className="mt-6">
          <StaysReservations
            reservations={mockStaysReservations}
            onSearch={handleSearch}
            onSort={handleSort}
            onExport={handleExport}
          />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <EventsReservations
            reservations={mockEventsReservations}
            onSearch={handleSearch}
            onSort={handleSort}
            onExport={handleExport}
          />
        </TabsContent>

        <TabsContent value="parking" className="mt-6">
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-lg font-semibold mb-2">
              Car Parks Coming Soon!
            </h3>
            <p className="text-sm">
              We're working on adding parking reservations.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
