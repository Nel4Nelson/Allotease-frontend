/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import { TicketGridProps } from "@/types/tickets";
import { TicketCard } from "./ticket-card";

export function TicketGrid({ tickets, isLoading }: TicketGridProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-4 p-4 bg-gray-100 rounded-2xl">
              <div className="w-[200px] h-[120px] bg-gray-300 rounded-2xl" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-300 rounded w-3/4" />
                <div className="h-4 bg-gray-300 rounded w-1/2" />
                <div className="h-4 bg-gray-300 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-[#71727A]">
          <svg
            className="mx-auto h-16 w-16 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
            />
          </svg>
          <h3 className="text-lg font-medium mb-2">No tickets found</h3>
          <p className="text-sm">
            You haven't booked any tickets yet. Start exploring!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
