"use client";
import React from "react";
import { EventsHeader } from "./events-header";
import { EventCard } from "./admin-event-card";

export function ReservationsEventsContent() {
  // Dummy data for events
  const dummyEvents = [
    {
      id: "suicide-prevention-strategies",
      title: "Timely and Adaptive Strategies to Optimize Suicide Prevention among Youth",
      dateTime: "Thursday • 6:00 PM GMT+1",
      imageUrl: "/images/event-banner.svg",
      badgeText: "Health",
      organizerName: "Mental Health Foundation",
      followerCount: "2.5K followers",
    },
    {
      id: "summer-music-festival",
      title: "Summer Music Festival",
      dateTime: "Saturday • 8:00 PM GMT+1", 
      imageUrl: "/images/event-banner.svg",
      badgeText: "Music",
      organizerName: "Festival Productions",
      followerCount: "15K followers",
    },
    {
      id: "business-networking-mixer",
      title: "Business Networking Mixer",
      dateTime: "Friday • 7:30 PM GMT+1",
      imageUrl: "/images/event-banner.svg", 
      badgeText: "Business",
      organizerName: "NetworkPro",
      followerCount: "8.2K followers",
    },
    {
      id: "art-gallery-opening",
      title: "Art Gallery Opening",
      dateTime: "Wednesday • 6:00 PM GMT+1",
      imageUrl: "/images/event-banner.svg",
      badgeText: "Arts",
      organizerName: "Modern Arts Gallery",
      followerCount: "3.1K followers", 
    },
    {
      id: "startup-pitch-competition",
      title: "Startup Pitch Competition",
      dateTime: "Tuesday • 5:00 PM GMT+1",
      imageUrl: "/images/event-banner.svg",
      badgeText: "Startup",
      organizerName: "Innovation Hub",
      followerCount: "12K followers",
    },
    {
      id: "food-wine-tasting",
      title: "Food & Wine Tasting",
      dateTime: "Sunday • 4:00 PM GMT+1", 
      imageUrl: "/images/event-banner.svg",
      badgeText: "Food",
      organizerName: "Culinary Experts",
      followerCount: "6.7K followers",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Events Header */}
      <EventsHeader />
      
      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyEvents.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            dateTime={event.dateTime}
            imageUrl={event.imageUrl}
            badgeText={event.badgeText}
            organizerName={event.organizerName}
            followerCount={event.followerCount}
          />
        ))}
      </div>
    </div>
  );
}