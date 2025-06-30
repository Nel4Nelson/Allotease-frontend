"use client";
import React from "react";
import Image from "next/image";
import { UserTicket } from "@/types/tickets";
import { useTicketActions } from "@/hooks/use-ticket-actions";

interface TicketCardProps {
  ticket: UserTicket;
  variant?: "grid" | "list";
}

export function TicketCard({ ticket }: TicketCardProps) {
  const { viewTicketDetails, downloadTicket, isLoading } = useTicketActions();

  const getStatusColor = (status: UserTicket["status"]) => {
    switch (status) {
      case "upcoming":
        return "text-green-600 bg-green-50";
      case "past":
        return "text-gray-600 bg-gray-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTypeIcon = (type: UserTicket["type"]) => {
    switch (type) {
      case "event":
        return (
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
            <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" />
          </svg>
        );
      case "stay":
        return (
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
            <path d="M240,208H224V136l2.34,2.34A8,8,0,0,0,237.66,127L139.31,28.68a16,16,0,0,0-22.62,0L18.34,127a8,8,0,0,0,11.32,11.31L32,136v72H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM48,120l80-80,80,80v88H48Zm32,40a8,8,0,0,1,8-8h32a8,8,0,0,1,8,8v48H80Zm64-32a8,8,0,0,1,8-8h16a8,8,0,0,1,8,8v16a8,8,0,0,1-8,8H152a8,8,0,0,1-8-8Z" />
          </svg>
        );
      case "car-park":
        return (
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
            <path d="M240,112H229.2L201.42,49.5A16,16,0,0,0,186.8,40H69.2a16,16,0,0,0-14.62,9.5L26.8,112H16a8,8,0,0,0,0,16h8v80a16,16,0,0,0,16,16H64a16,16,0,0,0,16-16V192h96v16a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16V128h8a8,8,0,0,0,0-16ZM69.2,56H186.8l24,56H45.2ZM64,208H40V192H64Zm128,0V192h24v16Zm24-32H40V128H216ZM56,160a8,8,0,0,1,8-8H80a8,8,0,0,1,0,16H64A8,8,0,0,1,56,160Zm112,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H176A8,8,0,0,1,168,160Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleCardClick = () => {
    viewTicketDetails(ticket.id);
  };

  return (
    <div
      className="flex flex-col lg:flex-row gap-4 items-start p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Ticket Image */}
      <div className="relative flex-shrink-0">
        <Image
          src={ticket.image.src}
          height={120}
          width={200}
          alt={ticket.image.alt}
          className="rounded-2xl object-cover"
        />

        {/* Status Badge */}
        <div
          className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            ticket.status
          )}`}
        >
          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
        </div>

        {/* Type Badge */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1 rounded-full">
          {getTypeIcon(ticket.type)}
        </div>
      </div>

      {/* Ticket Details */}
      <div className="flex-1 min-w-0 space-y-3">
        <div>
          <h3 className="text-[#1F2024] font-bold text-lg line-clamp-2 hover:text-[#FF5B00] transition-colors">
            {ticket.title}
          </h3>

          <p className="text-[#71727A] text-sm flex items-center gap-1 mt-1">
            <svg
              width="14"
              height="14"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM128,64a8,8,0,0,1,8,8v56l40,40a8,8,0,0,1-11.31,11.31L123.31,138A8,8,0,0,1,120,132V72A8,8,0,0,1,128,64Z" />
            </svg>
            {ticket.date.day} • {ticket.date.time}
          </p>
        </div>

        <hr className="border-[#E0E0E0]" />

        <div className="space-y-2">
          {/* Pricing */}
          <div className="flex items-center justify-between">
            <p className="text-[#1F3A3A] font-medium capitalize">
              {ticket.pricing.type}
              {ticket.pricing.amount && (
                <span className="text-[#FF5B00] font-bold ml-1">
                  {ticket.pricing.currency}
                  {ticket.pricing.amount}
                </span>
              )}
            </p>

            <p className="text-[#71727A] text-xs">
              Booking: {ticket.bookingDetails.bookingId}
            </p>
          </div>

          {/* Provider and Location */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="bg-[#FF5B00] border border-[#BC4300] h-[14px] w-[14px] rounded-full flex items-center justify-center">
                {ticket.provider.verified ? (
                  <svg width="8" height="8" fill="white" viewBox="0 0 256 256">
                    <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
                  </svg>
                ) : (
                  <Image
                    src="/icons/star.svg"
                    height={8}
                    width={8}
                    alt="Provider icon"
                    className="object-contain"
                  />
                )}
              </div>
              <span className="text-xs font-medium text-[#1F2024]">
                {ticket.provider.name}
              </span>
            </div>

            <span className="text-xs text-[#71727A]">
              {ticket.location.city} • {ticket.location.venue}
            </span>
          </div>

          {/* Additional Info */}
          {ticket.bookingDetails.attendees &&
            ticket.bookingDetails.attendees > 1 && (
              <p className="text-xs text-[#71727A]">
                {ticket.bookingDetails.attendees} attendee
                {ticket.bookingDetails.attendees > 1 ? "s" : ""}
              </p>
            )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            viewTicketDetails(ticket.id);
          }}
          className="px-4 py-2 text-[#FF5B00] hover:text-[#E04E00] font-medium text-sm transition-colors"
        >
          View Details
        </button>

        {ticket.status === "upcoming" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              downloadTicket(ticket.id);
            }}
            disabled={isLoading}
            className="px-4 py-2 bg-[#FF5B00] hover:bg-[#E04E00] text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Get Ticket"}
          </button>
        )}
      </div>
    </div>
  );
}
