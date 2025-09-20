"use client";
import React from "react";
import { EventsHeader } from "./events-header";
import { EventCard } from "@/components/ui/event-card";

export function ReservationsEventsContent() {
  // Dummy data for events
  const dummyEvents = [
    {
      id: "1",
      title: "Tech Conference 2024",
      dateTime: "Thursday • 6:00 PM GMT+1",
      imageUrl: "/images/event-banner.svg",
      badgeText: "Technology",
      organizerName: "TechCorp Events",
      followerCount: "2.5K followers",
    },
    {
      id: "2",
      title: "Summer Music Festival",
      dateTime: "Saturday • 8:00 PM GMT+1", 
      imageUrl: "/images/event-banner.svg",
      badgeText: "Music",
      organizerName: "Festival Productions",
      followerCount: "15K followers",
    },
    {
      id: "3",
      title: "Business Networking Mixer",
      dateTime: "Friday • 7:30 PM GMT+1",
      imageUrl: "/images/event-banner.svg", 
      badgeText: "Business",
      organizerName: "NetworkPro",
      followerCount: "8.2K followers",
    },
    {
      id: "4",
      title: "Art Gallery Opening",
      dateTime: "Wednesday • 6:00 PM GMT+1",
      imageUrl: "/images/event-banner.svg",
      badgeText: "Arts",
      organizerName: "Modern Arts Gallery",
      followerCount: "3.1K followers", 
    },
    {
      id: "5",
      title: "Startup Pitch Competition",
      dateTime: "Tuesday • 5:00 PM GMT+1",
      imageUrl: "/images/event-banner.svg",
      badgeText: "Startup",
      organizerName: "Innovation Hub",
      followerCount: "12K followers",
    },
    {
      id: "6",
      title: "Food & Wine Tasting",
      dateTime: "Sunday • 4:00 PM GMT+1", 
      imageUrl: "/images/event-banner.svg",
      badgeText: "Food",
      organizerName: "Culinary Experts",
      followerCount: "6.7K followers",
    },
  ];

  const handleEventClick = () => {
    // Navigate to individual event management
    window.location.href = "/allocation-admin/dashboard/reservations/events";
  };

  return (
    <div className="space-y-6">
      {/* Events Header */}
      <EventsHeader />
      
      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyEvents.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            dateTime={event.dateTime}
            imageUrl={event.imageUrl}
            badgeText={event.badgeText}
            organizerName={event.organizerName}
            followerCount={event.followerCount}
            onClick={handleEventClick}
          />
        ))}
      </div>
    </div>
  );
}