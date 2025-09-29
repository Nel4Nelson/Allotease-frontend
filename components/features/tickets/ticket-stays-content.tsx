"use client";
import React, { useState } from "react";
import { TicketsSectionHeader } from "./tickets-section-header";
import { TicketStayCard } from "./ticket-stay-card";
import { ShowMoreSection } from "./show-more-section";

export function TicketStaysContent() {
  // State for current stays
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for past stays
  const [pastCurrentPage, setPastCurrentPage] = useState(1);
  const [isPastLoading, setIsPastLoading] = useState(false);
  
  // Dummy data for current/upcoming stays
  const dummyStays = [
    {
      id: "wintess-garden-1",
      title: "Wintess Garden",
      location: "Awka, Anambra",
      imageUrl: "/images/stay-banner.svg",
      price: 455520,
      frequency: "Day",
      statusText: "Expires in 24Hours",
    },
    {
      id: "luxury-villa-2",
      title: "Luxury Villa Paradise",
      location: "Lagos",
      imageUrl: "/images/stay-banner.svg",
      price: 750000,
      frequency: "Night",
      statusText: "Expires in 24Hours",
    },
    {
      id: "cozy-apartment-3",
      title: "Cozy Downtown Apartment",
      location: "Abuja, FCT",
      imageUrl: "/images/stay-banner.svg",
      price: 125000,
      frequency: "Night",
      statusText: "Expires in 24Hours",
    },
  ];

  // Dummy data for Active stays
  const dummyPastStays = [
    {
      id: "past-beach-house-1",
      title: "Oceanview Beach House",
      location: "Port Harcourt, Rivers",
      imageUrl: "/images/stay-banner.svg",
      price: 320000,
      frequency: "Night",
      statusText: "Due in 13Hrs",
    },
    {
      id: "past-mountain-cabin-2",
      title: "Mountain Cabin Retreat",
      location: "Jos, Plateau",
      imageUrl: "/images/stay-banner.svg",
      price: 180000,
      frequency: "Night",
      statusText: "Due in 13Hrs",
    },
    {
      id: "past-city-hotel-3",
      title: "Downtown City Hotel",
      location: "Kano, Kano",
      imageUrl: "/images/stay-banner.svg",
      price: 95000,
      frequency: "Night",
      statusText: "Due in 13Hrs",
    },
  ];

  // Calculate pagination info for current stays
  const itemsPerPage = 3;
  const totalItems = 18; // Mock total
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = dummyStays.slice(0, currentPage * itemsPerPage);

  // Calculate pagination info for past stays
  const pastTotalItems = 24; // Mock total for past stays
  const pastTotalPages = Math.ceil(pastTotalItems / itemsPerPage);
  const pastCurrentItems = dummyPastStays.slice(0, pastCurrentPage * itemsPerPage);

  // Handlers for current stays
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

  const handleAccept = (stayId: string) => {
    console.log("Accept stay:", stayId);
    // TODO: Navigate to accept stay action
  };

  const handleRefund = (stayId: string) => {
    console.log("Refund stay:", stayId);
    // TODO: Navigate to refund stay action
  };

  // Handlers for past stays
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

  const handlePastAccept = (stayId: string) => {
    console.log("Past stay - no action available:", stayId);
    // No action for past stays
  };

  const handlePastRefund = (stayId: string) => {
    console.log("Past stay - no action available:", stayId);
    // No action for past stays
  };

  return (
    <div className="space-y-12">
      {/* Current/Upcoming Stays Section */}
      <div className="space-y-6">
        {/* Header Section */}
        <TicketsSectionHeader
          title="Unconfirmed"
          subtitle="You have a small window to confirm that you like the place."
        />

        {/* Stays List */}
        <div className="space-y-6">
          {currentItems.map((stay, index) => (
            <TicketStayCard
              key={`${stay.id}-${index}`}
              title={stay.title}
              location={stay.location}
              imageUrl={stay.imageUrl}
              price={stay.price}
              frequency={stay.frequency}
              statusText={stay.statusText}
              onAccept={() => handleAccept(stay.id)}
              onRefund={() => handleRefund(stay.id)}
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
          loadingText="Loading more stays..."
          showMoreText="Show more"
          statusInfo={{
            currentCount: currentItems.length,
            totalCount: totalItems,
            currentPage: currentPage,
            totalPages: totalPages,
          }}
        />
      </div>

      {/* Past Stays Section */}
      <div className="space-y-6">
        {/* Header Section */}
        <TicketsSectionHeader
          title="Your accommodations"
          subtitle="Find details about the your reservations here."
        />

        {/* Past Stays List */}
        <div className="space-y-6">
          {pastCurrentItems.map((stay, index) => (
            <TicketStayCard
              key={`past-${stay.id}-${index}`}
              title={stay.title}
              location={stay.location}
              imageUrl={stay.imageUrl}
              price={stay.price}
              frequency={stay.frequency}
              statusText={stay.statusText}
              onAccept={() => handlePastAccept(stay.id)}
              onRefund={() => handlePastRefund(stay.id)}
              disabled={true}
            />
          ))}
        </div>

        {/* Show More Section for Past Stays */}
        <ShowMoreSection
          showMoreButton={pastCurrentPage < pastTotalPages}
          showCollapseButton={pastCurrentPage > 1}
          onShowMore={handlePastShowMore}
          onCollapse={handlePastCollapse}
          isLoading={isPastLoading}
          loadingText="Loading more past stays..."
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