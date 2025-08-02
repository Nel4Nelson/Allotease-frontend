import React from "react";
import { EventsReservations } from "../../overview";

const EventPageHero = () => {
  const handleExport = () => {};
  const handleSearch = () => {};
  const handleSort = () => {};

  const reservations = [
    {
      id: "RES-1001",
      attendee: "Kingsley Promis",
      ticketCount: 2,
      date: "2024-01-19 10:00AM",
    },
    {
      id: "RES-1002",
      attendee: "Ada Eze",
      ticketCount: 1,
      date: "2024-02-01 02:30PM",
    },
    {
      id: "RES-1003",
      attendee: "Chika Obi",
      ticketCount: 4,
      date: "2024-03-15 09:00AM",
    },
    {
      id: "RES-1004",
      attendee: "Michael Umeh",
      ticketCount: 3,
      date: "2024-04-10 01:15PM",
    },
    {
      id: "RES-1005",
      attendee: "Ngozi Okafor",
      ticketCount: 5,
      date: "2024-05-20 11:45AM",
    },
  ];

  return (
    <div className="space-y-4">
      <EventsReservations
        reservations={reservations}
        onSearch={handleSearch}
        onSort={handleSort}
        onExport={handleExport}
        // loading={eventReservationsLoading}
      />
    </div>
  );
};

export default EventPageHero;
