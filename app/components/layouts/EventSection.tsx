"use client";

import { availableEventsList } from "@/data/home/availableEventsLists";
import React, { useState } from "react";
import { EventCardList } from "@/components/layouts/EventCardList";
import EventsNavList from "@/components/ui/eventsNavList";

const EventSection = () => {
  const [visibleCount, setVisibleCount] = useState(6); // 6 items initially
  const initialVisibleCount = 6;

  const handleSeeMore = () => {
    if (visibleCount >= availableEventsList.length) {
      // If all are shown, reset to initial
      setVisibleCount(initialVisibleCount);
    } else {
      // Else show more
      setVisibleCount((prev) => prev + 6);
    }
  };

  return (
    <div className="px-4 md:px-8">
      <EventsNavList />

      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-6 ">
          <EventCardList events={availableEventsList.slice(0, visibleCount)} />
        </div>

        <div className="mt-4 text-center hidden md:block">
          <button
            onClick={handleSeeMore}
            className="px-4 py-2 bg-[#F2F4F799] text-[#FF5B00] rounded-full font-medium h-[35px] text-center"
          >
            {visibleCount >= availableEventsList.length
              ? "Show Less"
              : "See More"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventSection;
