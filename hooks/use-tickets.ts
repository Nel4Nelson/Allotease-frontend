/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useCallback, useMemo } from "react";
import { UserTicket, TicketFilters } from "@/types/tickets";
import { sampleUserTickets, getFilteredTickets } from "@/data/sample-tickets";

export function useTickets() {
  const [tickets] = useState<UserTicket[]>(sampleUserTickets);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<TicketFilters>({
    type: "all",
    status: "all",
  });

  const filteredTickets = useMemo(() => {
    return getFilteredTickets(tickets, filters.type, filters.status);
  }, [tickets, filters]);

  const updateFilters = useCallback((newFilters: Partial<TicketFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const refreshTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In real app, would fetch from API
      console.log("Tickets refreshed");
    } catch (err) {
      setError("Failed to refresh tickets");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get ticket counts by type
  const ticketCounts = useMemo(() => {
    const counts = {
      all: tickets.length,
      event: tickets.filter((t) => t.type === "event").length,
      stay: tickets.filter((t) => t.type === "stay").length,
      "car-park": tickets.filter((t) => t.type === "car-park").length,
      upcoming: tickets.filter((t) => t.status === "upcoming").length,
      past: tickets.filter((t) => t.status === "past").length,
    };
    return counts;
  }, [tickets]);

  return {
    tickets: filteredTickets,
    allTickets: tickets,
    isLoading,
    error,
    filters,
    updateFilters,
    refreshTickets,
    ticketCounts,
  };
}
