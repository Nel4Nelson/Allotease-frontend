import React from "react";
import { Badge } from "@/components/ui/badge";

interface EventDetailsTicketSalesBadgeProps {
  eventDate: string; // ISO date string from API
  className?: string;
}

export function EventDetailsTicketSalesBadge({
  eventDate,
  className = "",
}: EventDetailsTicketSalesBadgeProps) {
  // Calculate days until event
  const getDaysUntilEvent = (): string => {
    if (!eventDate) {
      return "--";
    }

    const today = new Date();
    const eventDateObj = new Date(eventDate);

    // Reset time to start of day for accurate day calculation
    today.setHours(0, 0, 0, 0);
    eventDateObj.setHours(0, 0, 0, 0);

    const timeDifference = eventDateObj.getTime() - today.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    // Handle different scenarios
    if (daysDifference < 0) {
      return "0"; // Event has passed
    } else if (daysDifference === 0) {
      return "0"; // Event is today
    } else {
      return daysDifference.toString();
    }
  };

  const daysText = getDaysUntilEvent();
  const badgeText = `Ticket Sales ends in ${daysText} ${
    daysText === "1" ? "day" : "days"
  }`;

  return (
    <Badge variant="ticket-sales" className={className}>
      {badgeText}
    </Badge>
  );
}
