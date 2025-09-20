"use client";
import React from "react";
import Link from "next/link";
import { ContentHeader } from "@/components/ui/content-header";
import { PlusIconOrange } from "@/components/icons";

// Title Component (just the main title)
const EventsTitle = () => (
  <h1 className="text-[#1F2024] font-space-grotesk text-2xl font-bold leading-[140%] tracking-[-0.48px]">
    Created Events
  </h1>
);

// Action Button Component
const CreateEventButton = () => (
  <Link href="/allocation-admin/create?type=events">
    <button className="flex items-center justify-center gap-[15px] px-3 py-1.5 rounded-[51px] border border-[#FF5B00] hover:bg-orange-50 transition-colors">
      <span className="text-[#FF5B00] font-source-sans text-lg font-semibold">
        Create New Event
      </span>
      <PlusIconOrange />
    </button>
  </Link>
);

interface EventsHeaderProps {
  className?: string;
}

export function EventsHeader({ className = "" }: EventsHeaderProps) {
  return (
    <div className={className}>
      {/* Content Header with title and action button */}
      <ContentHeader title={<EventsTitle />} action={<CreateEventButton />} />

      {/* Description text below the header */}
      <p className="text-[#71727A] font-source-sans text-base font-normal leading-[142.745%] tracking-[-0.32px]">
        Events you created
      </p>
    </div>
  );
}
