"use client";
import React, { useState } from "react";
import { TicketsSectionHeader } from "./tickets-section-header";
import { TicketEventCard } from "./ticket-event-card";
import { ShowMoreSection } from "./show-more-section";

export function TicketEventsContent() {
  // State for current events
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for past events
  const [pastCurrentPage, setPastCurrentPage] = useState(1);
  const [isPastLoading, setIsPastLoading] = useState(false);
  
  // Dummy data for current/upcoming events
  const dummyEvents = [
    {
      id: "suicide-prevention-strategies",
      title: "Timely and Adaptive Strategies to Optimize Suicide Prevention among Youth",
      dateTime: "Thursday • 6:00 PM GMT+1",
      imageUrl: "/images/event-banner.svg",
      badgeText: "Free",
    },
    {
      id: "summer-music-festival",
      title: "Summer Music Festival",
      dateTime: "Saturday • 8:00 PM GMT+1",
      imageUrl: "/images/event-banner.svg",
      badgeText: "₦5,000",
    },
    {
      id: "tech-conference",
      title: "Tech Conference 2024",
      dateTime: "Friday • 10:00 AM GMT+1",
      imageUrl: "/images/event-banner.svg",
      badgeText: "₦15,000",
    },
  ];

  // Dummy data for past events
  const dummyPastEvents = [
    {
      id: "past-suicide-prevention-strategies-1",
      title: "Timely and Adaptive Strategies to Optimize Suicide Prevention among Youth",
      dateTime: "Thursday • 6:00 PM GMT+1",
      imageUrl: "/images/event-banner.svg",
      badgeText: "Free",
    },
    {
      id: "past-suicide-prevention-strategies-2",
      title: "Timely and Adaptive Strategies to Optimize Suicide Prevention among Youth",
      dateTime: "Thursday • 6:00 PM GMT+1",
      imageUrl: "/images/event-banner.svg",
      badgeText: "Free",
    },
    {
      id: "past-suicide-prevention-strategies-3",
      title: "Timely and Adaptive Strategies to Optimize Suicide Prevention among Youth",
      dateTime: "Thursday • 6:00 PM GMT+1",
      imageUrl: "/images/event-banner.svg",
      badgeText: "Free",
    },
  ];

  // Calculate pagination info for current events
  const itemsPerPage = 3;
  const totalItems = 12; // Mock total
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = dummyEvents.slice(0, currentPage * itemsPerPage);

  // Calculate pagination info for past events
  const pastTotalItems = 15; // Mock total for past events
  const pastTotalPages = Math.ceil(pastTotalItems / itemsPerPage);
  const pastCurrentItems = dummyPastEvents.slice(0, pastCurrentPage * itemsPerPage);

  // Handlers for current events
  const handleShowMore = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setIsLoading(false);
    }, 1000);
  };

  const handleCollapse = () => {
    setCurrentPage(1);
  };

  const handleGetTicket = (eventId: string) => {
    console.log("Get ticket for event:", eventId);
    // TODO: Navigate to ticket booking
  };

  // Handlers for past events
  const handlePastShowMore = () => {
    setIsPastLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPastCurrentPage(prev => prev + 1);
      setIsPastLoading(false);
    }, 1000);
  };

  const handlePastCollapse = () => {
    setPastCurrentPage(1);
  };

  const handlePastGetTicket = (eventId: string) => {
    console.log("Past event - no action available:", eventId);
    // No action for past events
  };

  return (
    <div className="space-y-12">
      {/* Current/Upcoming Events Section */}
      <div className="space-y-6">
        {/* Header Section */}
        <TicketsSectionHeader
          title="Events"
          subtitle="Find details about the events you are enrolled in here."
        />

        {/* Events List */}
        <div className="space-y-6">
          {currentItems.map((event, index) => (
            <TicketEventCard
              key={`${event.id}-${index}`}
              title={event.title}
              dateTime={event.dateTime}
              imageUrl={event.imageUrl}
              badgeText={event.badgeText}
              onGetTicket={() => handleGetTicket(event.id)}
              disabled={false}
            />
          ))}
        </div>

        {/* Show More Section */}
        <ShowMoreSection
          showMoreButton={currentPage < totalPages}
          showCollapseButton={currentPage > 1}
          onShowMore={handleShowMore}
          onCollapse={handleCollapse}
          isLoading={isLoading}
          loadingText="Loading more events..."
          showMoreText="Show more"
          statusInfo={{
            currentCount: currentItems.length,
            totalCount: totalItems,
            currentPage: currentPage,
            totalPages: totalPages,
          }}
        />
      </div>

      {/* Past Events Section */}
      <div className="space-y-6">
        {/* Header Section */}
        <TicketsSectionHeader
          title="Past events"
          subtitle="Find details about the events you are enrolled in here"
        />

        {/* Past Events List */}
        <div className="space-y-6">
          {pastCurrentItems.map((event, index) => (
            <TicketEventCard
              key={`past-${event.id}-${index}`}
              title={event.title}
              dateTime={event.dateTime}
              imageUrl={event.imageUrl}
              badgeText={event.badgeText}
              onGetTicket={() => handlePastGetTicket(event.id)}
              disabled={true}
            />
          ))}
        </div>

        {/* Show More Section for Past Events */}
        <ShowMoreSection
          showMoreButton={pastCurrentPage < pastTotalPages}
          showCollapseButton={pastCurrentPage > 1}
          onShowMore={handlePastShowMore}
          onCollapse={handlePastCollapse}
          isLoading={isPastLoading}
          loadingText="Loading more past events..."
          showMoreText="Show more"
          statusInfo={{
            currentCount: pastCurrentItems.length,
            totalCount: pastTotalItems,
            currentPage: pastCurrentPage,
            totalPages: pastTotalPages,
          }}
        />
      </div>
    </div>
  );
}