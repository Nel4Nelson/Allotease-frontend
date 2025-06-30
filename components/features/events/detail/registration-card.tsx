"use client";
import React from "react";
import { RegistrationCardProps } from "@/types/event-details";
import { useCounter } from "@/hooks/use-counter";

function AttendeeCounter() {
  const { count, increment, decrement, canIncrement, canDecrement } =
    useCounter({
      initialValue: 1,
      min: 1,
      max: 10,
    });

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={decrement}
        disabled={!canDecrement}
        className="w-8 h-8 rounded-full border border-[#8AAEA433] flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
          <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z" />
        </svg>
      </button>

      <span className="font-semibold text-lg min-w-[2rem] text-center">
        {count}
      </span>

      <button
        onClick={increment}
        disabled={!canIncrement}
        className="w-8 h-8 rounded-full border border-[#8AAEA433] flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
          <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
        </svg>
      </button>
    </div>
  );
}

export function RegistrationCard({
  registration,
  onRegister,
  isLoading = false,
}: RegistrationCardProps) {
  const formatPrice = () => {
    if (registration.pricing.type === "free") {
      return "Free";
    }
    return `${registration.pricing.currency}${registration.pricing.amount}`;
  };

  return (
    <div className="h-fit w-full max-w-sm md:max-w-full lg:w-[19rem] bg-[#F2F4F74D] border border-[#8AAEA433] flex flex-col rounded-lg overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-[#F2F4F7CC] w-full p-5 text-center">
        <h3 className="text-[#1F2024] font-bold text-xl">Register</h3>
        <p className="text-xs text-[#71727A] mt-1">
          Ticket sales ends {registration.deadline}
        </p>
      </div>

      {/* Content */}
      <div className="p-5 space-y-6 flex-1">
        {/* Attendee Selection */}
        <div className="flex items-center justify-between">
          <h6 className="font-semibold text-[#1F2024]">Entry</h6>
          <AttendeeCounter />
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2">
          <h6 className="font-semibold text-[#1F2024]">Fee:</h6>
          <span
            className={`font-semibold ${
              registration.pricing.type === "free"
                ? "text-green-600"
                : "text-[#FF5B00]"
            }`}
          >
            {formatPrice()}
          </span>
        </div>

        {/* Availability */}
        {registration.maxAttendees && registration.currentAttendees && (
          <div className="text-xs text-[#71727A]">
            {registration.currentAttendees} of {registration.maxAttendees} spots
            taken
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="p-5 pt-0">
        <button
          onClick={onRegister}
          disabled={!registration.isOpen || isLoading}
          className="w-full font-semibold text-lg bg-[#FF5B00] hover:bg-[#E04E00] disabled:bg-gray-400 px-4 py-3 text-white rounded-full transition-colors disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Registering...
            </div>
          ) : registration.isOpen ? (
            "Reserve a Spot"
          ) : (
            "Registration Closed"
          )}
        </button>
      </div>
    </div>
  );
}
