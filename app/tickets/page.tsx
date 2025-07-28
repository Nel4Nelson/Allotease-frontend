"use client";
import { TicketTabs } from "@/components/features/tickets/ticket-tab";
import React from "react";

const Ticket = () => {
  return (
    <div className="py-4">
      {/* Ticket Tabs with Content */}
      <TicketTabs />
    </div>
  );
};

export default Ticket;
