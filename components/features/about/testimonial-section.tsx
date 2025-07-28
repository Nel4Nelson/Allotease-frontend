/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { aboutPageData } from "@/data/about";

const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const RADIUS = 250;

const getXY = (
  index: number,
  total: number,
  width: number,
  isMobile: boolean
) => {
  const gap = 20;
  const itemWidth = 288;
  const totalWidth = total * itemWidth + (total - 1) * gap;
  const startX = -totalWidth / 2 + itemWidth / 2;

  if (isMobile) {
    const x = (index - Math.floor(total / 2)) * (itemWidth + gap);
    return { x, y: 0 };
  }

  const x = startX + index * (itemWidth + gap);
  const progress = index / (total - 1);
  const angle = progress * Math.PI;
  const y = -Math.sin(angle) * RADIUS;
  return { x, y };
};

export function TestimonialSection() {
  const { testimonials } = aboutPageData;
  const [startIndex, setStartIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(600);
  const [isMobile, setIsMobile] = useState(false);
  const [itemsVisible, setItemsVisible] = useState(5);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  const moveClockwise = () => {
    setStartIndex((prev) => (prev + 1) % testimonials.length);
  };

  const moveAntiClockwise = () => {
    setStartIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const startAutoRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(moveAntiClockwise, 4000);
  };

  const stopAutoRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setContainerWidth(300);
        setIsMobile(true);
        setItemsVisible(1);
      } else if (width < 768) {
        setContainerWidth(400);
        setIsMobile(false);
        setItemsVisible(3);
      } else if (width < 1024) {
        setContainerWidth(500);
        setIsMobile(false);
        setItemsVisible(5);
      } else {
        setContainerWidth(700);
        setIsMobile(false);
        setItemsVisible(5);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isHovered) {
      startAutoRotation();
    } else {
      stopAutoRotation();
    }

    return () => stopAutoRotation();
  }, [isHovered]);

  const visibleItems = [];
  for (let i = 0; i < itemsVisible; i++) {
    const index = (startIndex + i) % testimonials.length;
    visibleItems.push({ ...testimonials[index], id: index });
  }

  const getCardWidth = () => {
    if (isMobile) {
      return 200;
    } else if (containerWidth < 768) {
      return 240;
    } else {
      return 288;
    }
  };

  const handleCardHover = (isHovering) => {
    setIsHovered(isHovering);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="relative w-full mx-auto">
          <div className="relative h-[800px] w-full overflow-hidden rounded-xl bg-white">
            <div className="absolute w-full h-full flex justify-center items-center">
              {visibleItems.map((testimonial, i) => {
                const { x, y } = getXY(
                  i,
                  itemsVisible,
                  containerWidth,
                  isMobile
                );

                return (
                  <div
                    key={testimonial.id}
                    className="absolute shadow-lg rounded-xl px-6 py-4 text-center bg-[#FFF3E7] transition-all duration-1000 ease-in-out cursor-pointer"
                    style={{
                      width: `${getCardWidth()}px`,
                      transform: `translate(${x}px, ${y}px) scale(${
                        i === Math.floor(itemsVisible / 2) ? 1.2 : 0.9
                      })`,
                      opacity: 1,
                    }}
                    onMouseEnter={() => handleCardHover(true)}
                    onMouseLeave={() => handleCardHover(false)}
                  >
                    <div className="flex flex-col items-center">
                      <div className="relative w-14 h-14 mb-3 overflow-hidden rounded-full bg-gray-200">
                        <Image
                          src={testimonial.avatarSrc}
                          alt={`Avatar of ${testimonial.name}`}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>

                      <h3 className="text-[#1F3A3A] text-sm font-bold text-center mb-2">
                        {testimonial.name} <br /> {testimonial.role}
                      </h3>

                      <p className="text-center text-[#71727A] text-[10px] leading-relaxed">
                        {testimonial.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Using negative margin to pull text closer to carousel */}
          <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-0 -mt-96 relative z-10">
            <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl text-center text-[#1F3A3A] mb-6 leading-snug">
              Hear from other <br className="hidden sm:block" />
              <span className="text-[#B5651D]">Organizers & Attendees</span>
            </h2>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-6 sm:gap-8">
              <Button
                onClick={moveAntiClockwise}
                variant="outline"
                size="icon"
                className="bg-[#B5651D] text-white hover:bg-[#9A5518] border-[#B5651D] p-3 sm:p-4 rounded-full shadow-md hover:scale-105 transition-all duration-200"
                aria-label="Move anti-clockwise"
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                onClick={moveClockwise}
                variant="outline"
                size="icon"
                className="bg-[#B5651D] text-white hover:bg-[#9A5518] border-[#B5651D] p-3 sm:p-4 rounded-full shadow-md hover:scale-105 transition-all duration-200"
                aria-label="Move clockwise"
              >
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}