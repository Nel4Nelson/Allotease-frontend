"use client";
import React from "react";
import { RelatedEventsProps } from "@/types/event-details";
import { ServiceCard } from "@/components/features/shared/service-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function RelatedEvents({
  events,
  title = "Other events you may like",
  description = "Discover more events that might interest you based on your preferences.",
}: RelatedEventsProps) {
  // Convert EventDetail to ServiceItem format for compatibility
  const convertedEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    image: {
      src: event.images.hero,
      alt: event.title,
    },
    date: {
      day: new Date(event.dates.startDate).toLocaleDateString("en-US", {
        weekday: "long",
      }),
      time:
        new Date(event.dates.startDate).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }) + ` ${event.dates.timezone}`,
    },
    pricing: event.registration.pricing,
    provider: {
      name: event.organizer.name,
      followersCount: event.organizer.followersCount,
      verified: event.organizer.isVerified,
    },
    location: {
      city: event.location.city,
      address: event.location.venue,
    },
  }));

  return (
    <div className="py-8 border-t border-gray-200">
      <div className="mb-8 lg:max-w-[60%]">
        <h2 className="text-[#1F2024] font-bold text-lg md:text-2xl mb-2">
          {title}
        </h2>
        <p className="text-xs text-[#71727A] md:text-base">{description}</p>
      </div>

      <div className="w-full flex justify-center">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-[90%] md:w-[95%]"
        >
          <CarouselContent>
            {convertedEvents.map((event) => (
              <CarouselItem
                key={event.id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <ServiceCard items={[event]} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
