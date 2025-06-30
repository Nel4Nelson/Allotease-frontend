"use client";
import React from "react";
import Image from "next/image";

export function HeroBanner() {
  return (
    <section className="px-4 md:p-8">
      <div className="bg-[#FFF3E7] my-4 pl-2 md:pl-10 rounded-3xl flex justify-between flex-col md:flex-row items-center h-auto md:h-[15rem] gap-4 overflow-hidden">
        <div className="md:w-[50%] py-4 md:py-0 z-10">
          <h1 className="text-[#1F3A3A] font-bold text-lg my-2 md:text-3xl lg:text-4xl">
            Hottest Events
          </h1>
          <p className="text-[#71727A] text-sm my-2 md:text-base leading-relaxed">
            Stay connected to the pulse of your city. Explore trending events,
            secure your spot, and create unforgettable memories—all in one
            place.
          </p>
          <button className="text-[#FF5B00] border-[#FF5B00] border-2 rounded-full my-2 w-[6.5rem] h-[2rem] md:w-[10rem] md:h-[3rem] font-semibold hover:bg-[#FF5B00] hover:text-white transition-all duration-300">
            Take Action
          </button>
        </div>

        <div className="relative w-[250px] h-[200px] md:h-full">
          <Image
            src="/images/humanSwimming.png"
            alt="Person enjoying events and activities"
            fill
            className="rounded-2xl object-cover"
            priority
          />
          <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-[#FFF3E7] to-transparent z-10 pointer-events-none rounded-l-2xl" />
        </div>
      </div>
    </section>
  );
}
