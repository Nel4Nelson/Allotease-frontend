"use client";
import React from "react";
import { StatCard } from "./stat-card";
import { DataTable, ColumnConfig } from "@/components/ui/data-table";

export function EventsContent() {
  const eventsStats = [
    { title: "Total events", value: "42", percentage: "+8%" },
    { title: "Active events", value: "12", percentage: "+15%" },
    { title: "Tickets sold", value: "1,247", percentage: "+22%" },
    { title: "Event revenue", value: "N2,150,000", percentage: "+18%" },
  ];

  const eventsData = [
    {
      id: "RES-1002",
      attendee: "Kingsley Promise",
      tickets: ["#17", "#17", "#17"],
      dates: "2024-01-19 10:00 AM",
      avatar: "/icons/encircle-star-green-avatar.svg",
    },
    {
      id: "RES-1002",
      attendee: "Kingsley Promise",
      tickets: ["#17", "17", "#17"],
      dates: "2024-01-19 10:00 AM",
      avatar: "/icons/encircle-star-green-avatar.svg",
    },
    {
      id: "RES-1002",
      attendee: "Kingsley Promise",
      tickets: ["#17", "#17", "#17"],
      dates: "2024-01-19 10:00 AM",
      avatar: "/icons/encircle-star-green-avatar.svg",
    },
    {
      id: "RES-1002",
      attendee: "Kingsley Promise",
      tickets: ["#17", "#17", "#17"],
      dates: "2024-01-19 10:00 AM",
      avatar: "/icons/encircle-star-green-avatar.svg",
    },
    {
      id: "RES-1002",
      attendee: "Kingsley Promise",
      tickets: ["#17", "#17", "#17"],
      dates: "2024-01-19 10:00 AM",
      avatar: "/icons/encircle-star-green-avatar.svg",
    },
  ];

  const columns: ColumnConfig[] = [
    { key: "id", label: "Reservation ID", type: "text" },
    { key: "attendee", label: "Attendee", type: "guest" },
    { key: "tickets", label: "Tickets", type: "tickets" },
    { key: "dates", label: "Dates", type: "text" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {eventsStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            percentage={stat.percentage}
            isFirstCard={index === 0}
          />
        ))}
      </div>

      {/* Recent Events Table */}
      <DataTable
        title="Recent reservations"
        columns={columns}
        data={eventsData}
        variant="events"
      />
    </div>
  );
}
