"use client";

import { availableEventsList } from "@/data/availableEventsLists";
import { eventNavLists } from "@/data/eventNavlist";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Event = () => {
  // State to track the active link
  const [activeLink, setActiveLink] = useState<number | null>(0);

  // Handle click to set active link
  const handleLinkClick = (index: number) => {
    setActiveLink(index);
  };

  const [visibleCount, setVisibleCount] = useState(6); // 6 items initially

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 6); // Show 6 more on each click
  };

  return (
    <div className="p-4">
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
        <div>
          <h3 className="text-[#1F2024] font-bold text-lg my-2">
            Available events in your location
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

        {visibleCount < availableEventsList.length && (
          <div className="mt-4 text-center">
            <button
              onClick={handleSeeMore}
              className="px-4 py-2 bg-[#1F2024] text-white rounded-md font-medium"
            >
              See More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Event;
