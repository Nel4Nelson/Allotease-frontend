/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { aboutPageData } from "@/data/about";

const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
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
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  content: string;
  avatarSrc: string;
  copyIndex?: number;
}

// Create infinite scroll array
const createInfiniteArray = (items: TestimonialItem[], copies: number = 3): TestimonialItem[] => {
  const result: TestimonialItem[] = [];
  for (let i = 0; i < copies; i++) {
    result.push(...items.map(item => ({ ...item, copyIndex: i })));
  }
  return result;
};

// Horizontal positioning for infinite scroll
const getInfinitePosition = (
  index: number,
  activeIndex: number,
  isMobile: boolean
) => {
  const cardWidth = isMobile ? 300 : 344;
  const gap = isMobile ? 20 : 30;
  const offset = index - activeIndex;
  
  return {
    x: offset * (cardWidth + gap),
    scale: offset === 0 ? 1.2 : Math.abs(offset) === 1 ? 0.95 : 0.85,
    opacity: Math.abs(offset) <= 2 ? 1 : 0,
    zIndex: offset === 0 ? 30 : 20 - Math.abs(offset) * 5,
    bgOpacity: offset === 0 ? 'bg-[#fff3e7]' : 
               Math.abs(offset) === 1 ? 'bg-[rgba(255,243,231,0.8)]' : 
               'bg-[rgba(255,243,231,0.4)]'
  };
};

export function TestimonialSection() {
  const { testimonials } = aboutPageData;
  const [activeIndex, setActiveIndex] = useState(testimonials.length); // Start at middle copy
  const [isHovered, setIsHovered] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1440);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isMobile = viewportWidth < 768;
  
  // Create infinite array with 3 copies
  const infiniteTestimonials = createInfiniteArray(testimonials, 3);
  const originalLength = testimonials.length;
  const middleStart = originalLength;
  const middleEnd = originalLength * 2 - 1;

  const moveNext = () => {
    setActiveIndex((prev) => {
      const next = prev + 1;
      
      // If we're at the end of the last copy, reset to middle copy
      if (next >= infiniteTestimonials.length) {
        setTimeout(() => {
          setActiveIndex(middleStart);
        }, 50);
        return infiniteTestimonials.length - 1;
      }
      
      return next;
    });
  };

  const movePrev = () => {
    setActiveIndex((prev) => {
      const next = prev - 1;
      
      // If we're at the beginning of the first copy, reset to middle copy
      if (next < 0) {
        setTimeout(() => {
          setActiveIndex(middleEnd);
        }, 50);
        return 0;
      }
      
      return next;
    });
  };

  const startAutoRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(moveNext, 4000);
  };

  const stopAutoRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
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

  // Get current testimonial for dot indicator
  const getCurrentDotIndex = () => {
    return activeIndex % originalLength;
  };

  return (
    <section className="relative py-8 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20">
        
        {/* Testimonial Cards Container */}
        <div className="relative h-[500px] mb-8 md:mb-12 lg:mb-16">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {infiniteTestimonials.map((testimonial, index) => {
                const position = getInfinitePosition(index, activeIndex, isMobile);
                
                return (
                  <div
                    key={`${testimonial.id}-${testimonial.copyIndex || 0}`}
                    className={`absolute left-1/2 top-1/2 w-[280px] sm:w-[320px] md:w-[344px] 
                      ${position.bgOpacity} backdrop-blur-[21px] 
                      shadow-[0px_4px_10px_0px_rgba(0,0,0,0.04)] 
                      rounded-[20px] p-5 sm:p-6 md:p-8
                      transition-all duration-700 ease-out 
                      hover:scale-110 hover:!z-50 cursor-pointer`}
                    style={{
                      transform: `
                        translate(-50%, -50%)
                        translateX(${position.x}px) 
                        scale(${position.scale})
                      `,
                      opacity: position.opacity,
                      zIndex: position.zIndex,
                      visibility: Math.abs(index - activeIndex) > 2 ? 'hidden' : 'visible'
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => setActiveIndex(index)}
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* Avatar */}
                      <div className="relative w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4 rounded-full overflow-hidden bg-gray-200">
                        <Image
                          src={testimonial.avatarSrc}
                          alt={`${testimonial.name} avatar`}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>

                      {/* Name */}
                      <h3 className="font-space-grotesk font-bold text-[18px] sm:text-[20px] md:text-[24px] 
                        text-[#1f3a3a] tracking-[-0.48px] leading-[1.1] mb-2">
                        {testimonial.name}
                      </h3>

                      {/* Content */}
                      <p className="font-source-sans-pro text-[13px] sm:text-[14px] md:text-[16px] 
                        text-[#71727a] tracking-[-0.32px] leading-[1.4] 
                        max-w-[240px] sm:max-w-[280px] mx-auto">
                        {testimonial.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Title and Navigation */}
        <div className="flex flex-col items-center">
          {/* Title */}
          <h2 className="font-space-grotesk font-bold text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] 
            leading-[1.1] text-center tracking-[-0.96px] mb-6 md:mb-8">
            <span className="text-[#1f3a3a]">Hear from other </span>
            <br className="sm:hidden" />
            <span className="text-[#b5651d]">Hosts & Guests</span>
          </h2>

          {/* Navigation Buttons */}
          <div className="flex gap-4 sm:gap-6 mb-6">
            <button
              onClick={movePrev}
              className="bg-[#b5651d] p-2.5 sm:p-3 rounded-full text-white
                shadow-[0px_20px_41.3px_0px_rgba(0,0,0,0.18),0px_4px_4px_0px_inset_rgba(255,255,255,0.25)]
                hover:scale-110 active:scale-95 transition-transform duration-200"
              aria-label="Previous testimonials"
            >
              <ChevronLeftIcon />
            </button>
            
            <button
              onClick={moveNext}
              className="bg-[#b5651d] p-2.5 sm:p-3 rounded-full text-white
                shadow-[0px_20px_41.3px_0px_rgba(0,0,0,0.18),0px_4px_4px_0px_inset_rgba(255,255,255,0.25)]
                hover:scale-110 active:scale-95 transition-transform duration-200"
              aria-label="Next testimonials"
            >
              <ChevronRightIcon />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(middleStart + index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === getCurrentDotIndex() 
                    ? 'bg-[#b5651d] w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}