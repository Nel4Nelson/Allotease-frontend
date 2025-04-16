"use client"
import React from "react";

const Hero = () => {
  return (
    <div className="bg-[#FFF3E7] p-4 m-4 rounded-3xl">
      <h3 className="text-[#1F3A3A] font-bold text-lg my-2">Hottest Events</h3>
      <p className="text-[#71727A] text-sm my-2">
        Stay connected to the pulse of your city. Explore trending events,
        secure your spot, and create unforgettable memories—all in one place.
      </p>

      <button className="text-[#FF5B00] border-[#FF5B00] w-[6.5rem] h-[2rem] border rounded-full my-2">
        Take Action
      </button>
    </div>
  );
};

export default Hero;
