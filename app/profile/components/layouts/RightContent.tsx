"use client";

import { EventCardList } from "@/components/layouts/EventCardList";
import EventsNavList from "@/components/ui/eventsNavList";
import { availableEventsList } from "@/data/home/availableEventsLists";
import React, { useState } from "react";

const RightContent = () => {
  const initialVisibleCount = 1;
  const extraVisibleCount = 3;
  const [showExtra, setShowExtra] = useState(false);

  const handleToggle = () => {
    setShowExtra((prev) => !prev);
  };

  const firstEvents = availableEventsList.slice(0, initialVisibleCount);
  const extraEvents = availableEventsList.slice(
    initialVisibleCount,
    initialVisibleCount + extraVisibleCount
  );

  return (
    <div>
      <div className="my-6 space-y-6">
        <EventsNavList />
        {/* First 6 events */}
        <EventCardList events={firstEvents} flexRow />

        {/* Button in between */}
        <div className="text-center hidden md:block">
          <button
            onClick={handleToggle}
            className="px-4 py-2 bg-[#F2F4F799] text-[#FF5B00] rounded-full font-medium h-[35px]"
          >
            {showExtra ? "Show Less" : "See More"}
          </button>
        </div>

        {/* Only show next 3 when showExtra is true */}
        {showExtra && (
          <div>
            <h2 className="text-[#1F2024] font-bold my-2 text-lg md:text-3xl">
              Past Events
            </h2>

            <p className="text-[#71727A] font-source">
              Find details about the events you are enrolled in here.
            </p>

            <EventCardList events={extraEvents} flexRow />
          </div>
        )}
      </div>
    </div>
  );
};

export default RightContent;
