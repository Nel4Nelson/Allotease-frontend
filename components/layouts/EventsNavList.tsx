"use client"

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
    </div>
  );
}

export default EventsNavList