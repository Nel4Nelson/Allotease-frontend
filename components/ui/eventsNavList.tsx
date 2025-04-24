"use client"

import { Combobox } from '@/app/components/ui/ComboBox';
import { eventNavLists } from '@/data/home/eventNavlist';
import Link from 'next/link';
import React, { useState } from 'react'

const EventsNavList = () => {
  // State to track the active link
  const [activeLink, setActiveLink] = useState<number | null>(0);

  // Handle click to set active link
  const handleLinkClick = (index: number) => {
    setActiveLink(index);
  };

  return (
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

          <Combobox  />
        </div>
      </div>
    </div>
  );
}

export default EventsNavList