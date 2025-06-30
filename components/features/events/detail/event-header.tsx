"use client";
import React from "react";
import { EventHeaderProps } from "@/types/event-details";

export function EventHeader({ title, description, status }: EventHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Status Badge */}
      {status.ticketSalesEnding && (
        <button className="px-3 py-1 border border-[#B5651D] text-[#B5651D] text-sm rounded-full font-medium bg-orange-50 hover:bg-orange-100 transition-colors">
          Ticket Sales Ends Soon
        </button>
      )}

      {/* Event Title */}
      <h1 className="text-[#1F2024] font-bold text-xl md:text-3xl leading-tight">
        {title}
      </h1>

      {/* Event Description */}
      <div className="text-[#71727A] text-sm md:text-base leading-relaxed space-y-4">
        {description.split("\n\n").map((paragraph, index) => (
          <p key={index}>
            {paragraph.split("**").map((text, textIndex) =>
              textIndex % 2 === 1 ? (
                <strong
                  key={textIndex}
                  className="text-[#1F2024] font-semibold"
                >
                  {text}
                </strong>
              ) : (
                text
              )
            )}
          </p>
        ))}
      </div>
    </div>
  );
}
