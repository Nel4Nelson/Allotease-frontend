"use client";

import { availableEventsList } from "@/data/home/availableEventsLists";
import React, { useState } from "react";
import { Combobox } from "../ui/ComboBox";
import { EventCardList } from "@/components/layouts/EventCardList";
import EventsNavList from "@/components/layouts/EventsNavList";

const Events = () => {
  

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

      <div>
        <div className="mt-8">
          <h2 className="text-[#1F2024] font-bold my-2 text-lg md:text-3xl">
            Available events in your location
          </h2>

          <div className="font-source flex items-center justify-between my-1">
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#1F2024"
                viewBox="0 0 256 256"
              >
                <path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z"></path>
              </svg>

              <p className="md:text-xl">Awka, Anambra</p>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#1F2024"
                viewBox="0 0 256 256"
              >
                <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
              </svg>
            </div>

            <Combobox />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 my-6">
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

export default Events;
