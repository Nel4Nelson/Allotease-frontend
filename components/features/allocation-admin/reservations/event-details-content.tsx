"use client";
import React from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EventDetailsBanner } from "@/components/ui/event-details/event-details-banner";
import { StayDetailsHeader } from "./stay-details-header";
import { DataTable, ColumnConfig } from "@/components/ui/data-table";

interface EventDetailsContentProps {
  eventId: string;
}

export function EventDetailsContent({ eventId }: EventDetailsContentProps) {
  // Get event title based on eventId (similar to stay details logic)
  const getEventTitle = (id: string) => {
    const titleMap: { [key: string]: string } = {
      "suicide-prevention-strategies": "Timely and Adaptive Strategies to Optimize Suicide Prevention among Youth",
      "summer-music-festival": "Summer Music Festival",
      "business-networking-mixer": "Business Networking Mixer",
      "art-gallery-opening": "Art Gallery Opening",
      "startup-pitch-competition": "Startup Pitch Competition",
      "food-wine-tasting": "Food & Wine Tasting",
    };
    return titleMap[id] || "Event Details";
  };

  const eventTitle = getEventTitle(eventId);

  // Use the event placeholder image
  const eventImageUrl = "/images/event-banner.svg";

  // Registration Management table data
  const registrationData = [
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

  const registrationColumns: ColumnConfig[] = [
    { key: "id", label: "Reservation ID", type: "text" },
    { key: "attendee", label: "Attendee", type: "guest" },
    { key: "tickets", label: "Tickets", type: "tickets" },
    { key: "dates", label: "Dates", type: "text" },
  ];

  const handleEditClick = () => {
    // TODO: Implement edit functionality for event context
    console.log("Edit event details clicked for:", eventId);
  };

  const handleExportRegistrations = () => {
    // TODO: Implement export functionality for event registrations
    console.log("Export registrations table for:", eventId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb className="" />
      
      {/* Event Banner */}
      <EventDetailsBanner 
        imageUrl={eventImageUrl}
        alt={`${eventTitle} banner`}
      />

      {/* Event Header with Title and Edit Button */}
      <StayDetailsHeader 
        stayTitle={eventTitle}
        type="event"
        onEditClick={handleEditClick}
      />

      {/* Registration Management Table */}
      <DataTable
        title="Registration Management"
        columns={registrationColumns}
        data={registrationData}
        variant="events"
        showSearch={true}
        showSort={true}
        showExport={true}
        searchPlaceholder="Search by address"
        onExport={handleExportRegistrations}
      />
    </div>
  );
}