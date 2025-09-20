"use client";
import React from "react";
import { StatCard } from "./stat-card";
import { DataTable, ColumnConfig } from "@/components/ui/data-table";

export function StaysContent() {
  const staysStats = [
    { title: "Total reservation", value: "124", percentage: "+12%" },
    { title: "Check-ins today", value: "8", percentage: "+2%" },
    { title: "Available spaces", value: "124", percentage: "-3%" },
    { title: "Revenue this month", value: "N450,000", percentage: "+12%" },
  ];

  const reservationsData = [
    {
      id: "RES-1002",
      guest: "Kingsley Promise",
      room: "Classic King Room",
      dates: "May 31 - Jun 1",
      status: "Pending",
      avatar: "/icons/encircle-star-green-avatar.svg",
    },
    {
      id: "RES-1002",
      guest: "Kingsley Promise",
      room: "Classic King Room",
      dates: "May 31 - Jun 1",
      status: "Cancelled",
      avatar: "/icons/encircle-star-green-avatar.svg",
    },
    {
      id: "RES-1002",
      guest: "Kingsley Promise",
      room: "Classic King Room",
      dates: "May 31 - Jun 1",
      status: "Confirmed",
      avatar: "/icons/encircle-star-green-avatar.svg",
    },
  ];

  const columns: ColumnConfig[] = [
    { key: "id", label: "Reservation ID", type: "text" },
    { key: "guest", label: "Guest", type: "guest" },
    { key: "room", label: "Room", type: "text" },
    { key: "dates", label: "Dates", type: "text" },
    { key: "status", label: "Status", type: "status" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {staysStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            percentage={stat.percentage}
            isFirstCard={index === 0}
          />
        ))}
      </div>

      {/* Recent Reservations Table */}
      <DataTable
        title="Recent reservations"
        columns={columns}
        data={reservationsData}
        variant="reservations"
      />
    </div>
  );
}
