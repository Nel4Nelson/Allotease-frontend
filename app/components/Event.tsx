"use client";

import { availableEventsList } from "@/data/home/availableEventsLists";
import { eventNavLists } from "@/data/home/eventNavlist";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Combobox } from "./ui/ComboBox";

const Event = () => {
  // State to track the active link
  const [activeLink, setActiveLink] = useState<number | null>(0);

  // Handle click to set active link
  const handleLinkClick = (index: number) => {
    setActiveLink(index);
  };

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
      <div>
        <ul className="border border-[#8AAEA433 flex items-center justify-around w-[15rem] rounded-lg h-[40px]">
          {eventNavLists.map((eventNavList, i) => (
            <li key={i}>
              <Link
                href={eventNavList.link}
                onClick={() => handleLinkClick(i)} // Set active link on click
              >
                <h2
                  className={`font-semibold ${
                    activeLink === i ? "text-[#1F2024]" : "text-[#71727A]"
                  }`} // Change text color based on active link
                >
                  {eventNavList.name}
                </h2>
              </Link>
            </li>
          ))}
        </ul>
      </div>

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
          {availableEventsList.slice(0, visibleCount).map((list, i) => (
            <div key={i}>
              <Image
                src={list.imgLink}
                height={170}
                width={361}
                alt={list.imgAlt}
                className="rounded-2xl"
              />

              <div>
                <h3 className="text-[#1F2024] font-bold text-lg my-2">
                  Timely and Adaptive Strategies to Optimize Suicide
                  Prevention...{" "}
                </h3>
                <p className="text-[#71727A]">
                  {list.date.day} • {list.date.time}
                </p>

                <hr className="#E0E0E0 my-2" />

                <div className="text-xs font-source">
                  <p className="text-[#1F3A3A]">{list.status}</p>
                  <div className="text-[#71727A] flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="bg-[#FF5B00] border border-[#BC4300] h-[14px] w-[14px] rounded-full flex items-center justify-center  p-[1px]">
                        <Image
                          src="/icons/star.svg"
                          height={10}
                          width={10}
                          alt="star icon"
                          className="object-contain"
                        />
                      </div>
                      <p>{list.location}</p>
                    </div>

                    <p>{list.followersCount}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
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

export default Event;
