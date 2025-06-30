"use client";
import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Organizer {
  id: string;
  name: string;
  followersCount: string;
  avatar: string;
  verified: boolean;
}

const featuredOrganizers: Organizer[] = [
  {
    id: "1",
    name: "Flend Worldwide",
    followersCount: "117.5K",
    avatar: "/icons/star.svg",
    verified: true,
  },
  {
    id: "2",
    name: "TechHub Africa",
    followersCount: "234.1K",
    avatar: "/icons/star.svg",
    verified: true,
  },
  {
    id: "3",
    name: "Youth Empowerment",
    followersCount: "67.4K",
    avatar: "/icons/star.svg",
    verified: false,
  },
  {
    id: "4",
    name: "Green Earth Initiative",
    followersCount: "156.9K",
    avatar: "/icons/star.svg",
    verified: true,
  },
  {
    id: "5",
    name: "Cultural Heritage",
    followersCount: "92.3K",
    avatar: "/icons/star.svg",
    verified: false,
  },
];

export function FeaturedOrganizers() {
  return (
    <section className="my-8 px-4 md:px-8">
      <div className="mb-6">
        <h2 className="text-[#1F2024] font-bold text-lg md:text-2xl mb-2">
          Featured Organizers
        </h2>
        <p className="text-[#71727A] text-sm">
          Discover amazing events from these trusted organizers
        </p>
      </div>

      <div className="w-full flex justify-center">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-[70%] md:w-[80%] lg:w-[90%]"
        >
          <CarouselContent>
            {featuredOrganizers.map((organizer) => (
              <CarouselItem
                key={organizer.id}
                className="md:basis-1/2 lg:basis-1/4"
              >
                <div className="p-1">
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="aspect-square flex flex-col items-center justify-between gap-4 bg-[#F2F4F7] h-full rounded-xl p-6">
                      <div className="bg-[#FF5B00] border border-[#BC4300] h-[80px] w-[80px] rounded-full flex items-center justify-center p-2 relative">
                        <Image
                          src={organizer.avatar}
                          height={40}
                          width={40}
                          alt={`${organizer.name} avatar`}
                          className="object-contain"
                        />
                        {organizer.verified && (
                          <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                            <svg
                              width="12"
                              height="12"
                              fill="white"
                              viewBox="0 0 256 256"
                            >
                              <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="text-center">
                        <h5 className="font-bold text-lg text-[#1F2024] mb-1">
                          {organizer.name}
                        </h5>
                        <p className="text-[#71727A] text-sm">
                          {organizer.followersCount} Followers
                        </p>
                      </div>

                      <button className="font-semibold text-sm text-[#FF5B00] w-[4.75rem] h-[2.2rem] rounded-full border border-[#FF5B00] hover:bg-[#FF5B00] hover:text-white transition-all duration-300">
                        Follow
                      </button>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
