import React from "react";
import Balance from "../../../../components/layouts/Balance";
import FollowCard from "@/components/layouts/FollowCard";
import EventsNavList from "@/components/ui/eventsNavList";
import { EventCardList } from "@/components/layouts/EventCardList";
import { availableEventsList } from "@/data/home/availableEventsLists";

const Hero = () => {
  return (
    <div className="px-4 md:px-8 py-2 sm:py-4">
      <div className="relative mb-4">
        <div className="bg-[#2F4F4F] h-[14rem] p-2 rounded-2xl">
          <div className="flex justify-end items-center gap-1">
            <p className="text-[#D5FFEB80] hidden md:block">
              Withdrawal History
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#D5FFEB80"
              viewBox="0 0 256 256"
            >
              <path d="M168,152a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,152Zm-8-40H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm56-64V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V48A16,16,0,0,1,56,32H92.26a47.92,47.92,0,0,1,71.48,0H200A16,16,0,0,1,216,48ZM96,64h64a32,32,0,0,0-64,0ZM200,48H173.25A47.93,47.93,0,0,1,176,64v8a8,8,0,0,1-8,8H88a8,8,0,0,1-8-8V64a47.93,47.93,0,0,1,2.75-16H56V216H200Z"></path>
            </svg>
          </div>

          <Balance />
        </div>

        <div className="absolute left-1/2 translate-x-[-50%] bottom-[-1.5rem] w-[90%] max-w-[400px]">
          <FollowCard username="Flend Worldwide" withdraw />
        </div>
      </div>

      <div className="mt-10">
        <EventsNavList />
        <div className="flex justify-around flex-wrap gap-8">
          <EventCardList events={availableEventsList.slice(0, 3)} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
