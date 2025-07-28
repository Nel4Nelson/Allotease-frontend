"use client";

import { TicketEventCard } from "./ticket-event-card";

interface TicketEventsContentProps {
  className?: string;
}

export function TicketEventsContent({
  className = "",
}: TicketEventsContentProps) {
  // Mock data for now - will replace with API later
  const mockEvents = [
    {
      id: "1",
      title: "Timely and Adaptive Strategies to Optimize Suicide Prevention...",
      dateTime: "Thursday • 6:00 PM GMT+1",
      imageUrl: "/api/placeholder/326/176",
      badgeText: "Free",
    },
    {
      id: "2",
      title: "Timely and Adaptive Strategies to Optimize Suicide Prevention...",
      dateTime: "Thursday • 6:00 PM GMT+1",
      imageUrl: "/api/placeholder/326/176",
      badgeText: "Free",
    },
    {
      id: "3",
      title: "Timely and Adaptive Strategies to Optimize Suicide Prevention...",
      dateTime: "Thursday • 6:00 PM GMT+1",
      imageUrl: "/api/placeholder/326/176",
      badgeText: "Free",
    },
  ];

  const mockPastEvents = [
    {
      id: "4",
      title: "Timely and Adaptive Strategies to Optimize Suicide Prevention...",
      dateTime: "Thursday • 6:00 PM GMT+1",
      imageUrl: "/api/placeholder/326/176",
      badgeText: "Free",
    },
    {
      id: "5",
      title: "Timely and Adaptive Strategies to Optimize Suicide Prevention...",
      dateTime: "Thursday • 6:00 PM GMT+1",
      imageUrl: "/api/placeholder/326/176",
      badgeText: "Free",
    },
    {
      id: "6",
      title: "Timely and Adaptive Strategies to Optimize Suicide Prevention...",
      dateTime: "Thursday • 6:00 PM GMT+1",
      imageUrl: "/api/placeholder/326/176",
      badgeText: "Free",
    },
  ];

  const handleEventClick = (eventId: string) => {
    console.log("Event clicked:", eventId);
  };

  const handleGetTicket = (eventId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    console.log("Get ticket for event:", eventId);
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Events Section */}
      <div className="space-y-4">
        {/* Content Header */}
        <div className="space-y-2">
          <h2
            style={{
              color: "var(--Title, #1F2024)",
              fontFamily: '"Space Grotesk"',
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "140%",
              letterSpacing: "-0.48px",
              margin: 0,
            }}
          >
            Events
          </h2>
          <p
            style={{
              color: "var(--Body, #71727A)",
              fontFamily: "var(--font-source-sans), sans-serif",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "142.745%",
              letterSpacing: "-0.32px",
              margin: 0,
            }}
          >
            Find tickets about the events you are excited to hear...
          </p>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {mockEvents.map((event) => (
            <TicketEventCard
              key={event.id}
              title={event.title}
              dateTime={event.dateTime}
              imageUrl={event.imageUrl}
              badgeText={event.badgeText}
              onClick={() => handleEventClick(event.id)}
              onGetTicket={(e) => handleGetTicket(event.id, e)}
            />
          ))}
        </div>
      </div>

      {/* Past Events Section */}
      <div className="space-y-4">
        {/* Content Header */}
        <div className="space-y-2">
          <h2
            style={{
              color: "var(--Title, #1F2024)",
              fontFamily: '"Space Grotesk"',
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "140%",
              letterSpacing: "-0.48px",
              margin: 0,
            }}
          >
            Past events
          </h2>
          <p
            style={{
              color: "var(--Body, #71727A)",
              fontFamily: "var(--font-source-sans), sans-serif",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "142.745%",
              letterSpacing: "-0.32px",
              margin: 0,
            }}
          >
            Find details about the events you are enrolled in here.
          </p>
        </div>

        {/* Past Events List */}
        <div className="space-y-4">
          {mockPastEvents.map((event) => (
            <TicketEventCard
              key={event.id}
              title={event.title}
              dateTime={event.dateTime}
              imageUrl={event.imageUrl}
              badgeText={event.badgeText}
              onClick={() => handleEventClick(event.id)}
              onGetTicket={(e) => handleGetTicket(event.id, e)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
