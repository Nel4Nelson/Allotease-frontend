// /components/features/create/events/event-preview.tsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { EventPreviewData } from "@/types/events";

interface EventPreviewProps {
  data: EventPreviewData;
  onEdit: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export function EventPreview({ data, onEdit, onSubmit, isLoading }: EventPreviewProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTimeRange = (startTime: string, endTime?: string) => {
    const start = formatTime(startTime);
    if (endTime) {
      const end = formatTime(endTime);
      return `${start} - ${end}`;
    }
    return start;
  };

  return (
    <div className="space-y-6">
      {/* Preview Header */}
      <div className="text-center space-y-2 pb-6 border-b border-[var(--input-border)]">
        <h2 className="text-2xl font-bold font-space-grotesk text-[var(--title-color)]">
          Preview Your Event
        </h2>
        <p className="text-[var(--body-text)] font-source-sans-pro">
          Review your event details before publishing. You can make changes if needed.
        </p>
      </div>

      {/* Event Preview Content */}
      <div className="max-w-2xl mx-auto">
        {/* Cover Image */}
        {data.image && (
          <div className="mb-6">
            <img
              src={URL.createObjectURL(data.image)}
              alt={data.title}
              className="w-full h-64 object-cover rounded-lg border border-[var(--input-border)]"
            />
          </div>
        )}

        {/* Event Title & Description */}
        <div className="space-y-4 mb-6">
          <h1 className="text-3xl font-bold font-space-grotesk text-[var(--title-color)]">
            {data.title}
          </h1>
          
          <p className="text-[var(--body-text)] font-source-sans-pro leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Date & Time */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold font-space-grotesk text-[var(--title-color)] mb-3">
            Date & Time
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-[var(--body-text)] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-source-sans-pro text-[var(--title-color)]">
                {formatDate(data.startTime)} • {formatTimeRange(data.startTime, data.endTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Location */}
        {data.eventType === "venue" && data.location && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold font-space-grotesk text-[var(--title-color)] mb-3">
              Location
            </h3>
            
            <div className="flex items-start">
              <svg className="w-5 h-5 text-[var(--body-text)] mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="space-y-1">
                <p className="font-source-sans-pro text-[var(--title-color)]">
                  {data.location.placeName || "Event Venue"}
                </p>
                <p className="font-source-sans-pro text-[var(--body-text)] text-sm">
                  {data.location.address}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Event Type */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold font-space-grotesk text-[var(--title-color)] mb-3">
            Event Format
          </h3>
          
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${
              data.eventType === "remote" ? "bg-blue-500" : "bg-green-500"
            }`}></div>
            <span className="font-source-sans-pro text-[var(--title-color)] capitalize">
              {data.eventType === "remote" ? "Online Event" : "In-Person Event"}
            </span>
          </div>
        </div>

        {/* Agenda */}
        {data.agenda && data.agenda.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold font-space-grotesk text-[var(--title-color)] mb-4">
              Event Details
            </h3>
            
            <div className="space-y-4">
              {data.agenda.map((item, index) => (
                <div key={index} className="border-l-2 border-[var(--feature-accent-orange)] pl-4">
                  <div className="flex items-center text-sm text-[var(--body-text)] font-source-sans-pro mb-1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatTimeRange(item.startTime, item.endTime)}
                  </div>
                  <h4 className="font-semibold text-[var(--title-color)] font-source-sans-pro mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[var(--body-text)] font-source-sans-pro text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {data.tags && data.tags.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold font-space-grotesk text-[var(--title-color)] mb-3">
              Categories
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium font-source-sans-pro bg-[var(--feature-accent-orange)] text-white"
                >
                  <span className="w-2 h-2 rounded-full bg-white mr-2" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Capacity & Pricing */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold font-space-grotesk text-[var(--title-color)] mb-3">
            Registration
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-source-sans-pro text-[var(--body-text)]">Capacity:</span>
              <span className="font-semibold font-source-sans-pro text-[var(--title-color)]">
                {data.capacity} attendees
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-source-sans-pro text-[var(--body-text)]">Entry:</span>
              <span className="font-semibold font-source-sans-pro text-[var(--title-color)]">
                {data.isFree ? "Free" : `$${data.price}`}
              </span>
            </div>
          </div>
          
          <Button
            className="w-full mt-4"
            variant="signup-primary"
            disabled
          >
            Register Now
          </Button>
        </div>

        {/* Organizer Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold font-space-grotesk text-[var(--title-color)] mb-3">
            Organizer
          </h3>
          
          <div className="flex items-center">
            <div className="w-12 h-12 bg-[var(--feature-accent-orange)] rounded-full flex items-center justify-center text-white font-bold mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold font-source-sans-pro text-[var(--title-color)]">
                {data.organizerName || "Organization Admin"}
              </p>
              <p className="text-sm text-[var(--body-text)] font-source-sans-pro">
                Event Organizer
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              disabled
            >
              Follow
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t border-[var(--input-border)]">
        <Button
          type="button"
          variant="ghost"
          onClick={onEdit}
          className="px-8"
        >
          ← Edit Event
        </Button>
        
        <Button
          type="button"
          variant="signup-primary"
          size="allotease-lg"
          onClick={onSubmit}
          disabled={isLoading}
          loading={isLoading}
          className="px-8"
        >
          Create Event
        </Button>
      </div>
    </div>
  );
}