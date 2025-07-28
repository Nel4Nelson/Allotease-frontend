import React from "react";
import { Badge } from "@/components/ui/badge";
import { useEventFormStore } from "@/stores/event-form-store";

interface TicketSalesBadgeProps {
  className?: string;
}

export function TicketSalesBadge({ className = "" }: TicketSalesBadgeProps) {
  const { formData } = useEventFormStore();

  // Calculate days until event
  const getDaysUntilEvent = (): string => {
    if (!formData.eventDate) {
      return "--";
    }

    const today = new Date();
    const eventDate = new Date(formData.eventDate);

    // Reset time to start of day for accurate day calculation
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    const timeDifference = eventDate.getTime() - today.getTime();
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
