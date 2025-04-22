"use client"

import { EventCardList } from '@/components/layouts/EventCardList';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { availableEventsList } from '@/data/home/availableEventsLists';
import React from 'react'


const EventList = () => {
  return (
    <div className="p-4 md:p-8">
      <div className=" lg:max-w-[60%]">
        <h2 className="text-[#1F2024] font-bold my-3 text-lg md:text-3xl leading-snug">
          Other events you may like
        </h2>
        <p className="text-xs text-[#71727A] md:text-base">
          Get to know the peers in the room. An interactive activity to get
          conversations going before we head into lunch.
        </p>
      </div>

      <div className="mt-14">
        <div className="w-full flex justify-center">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-[70%] md:w-[80%]"
          >
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <EventCardList events={[availableEventsList[index]]} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default EventList;