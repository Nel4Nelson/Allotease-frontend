"use client";
import React from "react";
import { StaysHeader } from "./stays-header";
import { AdminStayCard } from "./admin-stay-card";

export function ReservationsStaysContent() {
  // Dummy data for stays
  const dummyStays = [
    {
      id: "1",
      title: "Timely and Adaptive Strategies to Optimize Suicide Prevention...",
      dateTime: "Thursday • 6:00 PM GMT+1",
      description:
        "Experience luxury living in the heart of the city with modern amenities and stunning views.",
    },
    {
      id: "2",
      title: "Modern Downtown Apartment",
      dateTime: "Wednesday • 4:30 PM GMT+1",
      description:
        "Cozy beachfront villa perfect for weekend getaways with private beach access.",
    },
    {
      id: "3",
      title: "Beachfront Villa Paradise",
      dateTime: "Tuesday • 2:15 PM GMT+1",
      description:
        "Elegant mountain cabin surrounded by nature, ideal for peaceful retreats.",
    },
    {
      id: "4",
      title: "Mountain View Cabin",
      dateTime: "Monday • 8:45 AM GMT+1",
      description:
        "Spacious family home with garden and playground, perfect for family vacations.",
    },
    {
      id: "5",
      title: "Family Garden House",
      dateTime: "Sunday • 11:20 AM GMT+1",
      description:
        "Historic city center loft with exposed brick walls and modern renovations.",
    },
    {
      id: "6",
      title: "Historic Loft Space",
      dateTime: "Saturday • 7:00 PM GMT+1",
      description:
        "Lakeside cottage with fishing dock and kayak rentals included in stay.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stays Header */}
      <StaysHeader />

      {/* Stay Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyStays.map((stay) => (
          <AdminStayCard
            key={stay.id}
            title={stay.title}
            dateTime={stay.dateTime}
            description={stay.description}
          />
        ))}
      </div>
    </div>
  );
}
