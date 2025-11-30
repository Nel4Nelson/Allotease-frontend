"use client";
import React from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export function HeroBanner() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "stays";

  const content = {
    stays: {
      headline: "You Need Your Space? Let's Help You Book it.",
      subCopy: "From cozy apartments to student hostels and hotels, to work and shop spaces, discover spaces that fit your style, budget, and plans — wherever life takes you.",
      image: "/images/space-booking.jpg",
      imageAlt: "Person relaxing by the water"
    },
    events: {
      headline: "The Buzz is Not Fun Without You.",
      subCopy: "Join the buzz. Explore trending events, grab your tickets, and step outside with Allotease.",
      image: "/images/african-event.jpg",
      imageAlt: "Events and activities"
    }
  };

  const currentContent = type === "events" ? content.events : content.stays;

  return (
    <section className="px-1">
      <div className="bg-[#FFF3E7] pl-5 md:pl-10 rounded-3xl flex justify-between flex-col md:flex-row items-center h-auto md:h-[18rem] gap-4 overflow-hidden relative">
        {/* Background blur effect */}
        <div className="absolute inset-0 -z-10 bg-[#FFF3E7] blur-[76px]" />

        <div className="md:w-[50%] py-5 pr-5 md:py-0 md:pr-0 z-10">
          <h1 className="font-space-grotesk font-bold text-[20px] md:text-3xl lg:text-[32px] leading-[110%] tracking-[-0.36px] my-2 text-[#1F3A3A] md:text-[var(--allotease-teal)]">
            {currentContent.headline}
          </h1>
          <p className="font-source-sans !text-[20px] md:text-base font-normal leading-[142.745%] tracking-[-0.28px] my-2 max-w-[500px] text-[#71727A] md:text-[var(--body-text)]">
            {currentContent.subCopy}
          </p>
          {/* <button className="font-semibold my-2 transition-all duration-300 hover:bg-[#FF5B00] hover:text-white text-[#FF5B00] border border-[var(--feature-accent-orange)] rounded-[51px] px-3 py-1.5 flex justify-center items-center gap-[15px]">
            Get Started 
          </button> */}
        </div>

        {/* Image - Hidden on mobile, shown on desktop */}
        <div className="hidden md:block relative w-[250px] h-[200px] md:h-full">
          <Image
            src={currentContent.image}
            alt={currentContent.imageAlt}
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