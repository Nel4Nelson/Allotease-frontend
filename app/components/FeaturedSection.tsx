// "use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export function FeaturedSection() {
  return (
    <div className="my-6">
      <div className="w-full flex justify-center">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-[70%] md:w-[80%]"
        >
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                <div className="p-1">
                  <Card>
                    <CardContent className=" aspect-square flex flex-col items-center justify-between gap-4 bg-[#F2F4F7] h-[100%] rounded-xl p-6">
                      <div className="bg-[#FF5B00] border border-[#BC4300] h-[80px] w-[80px] rounded-full flex items-center justify-center p-[1px]">
                        <Image
                          src="/icons/star.svg"
                          height={40}
                          width={40}
                          alt="star icon"
                          className="object-contain"
                        />
                      </div>

                      <div className="text-center">
                        <h5 className="font-bold text-lg">Flend Worldwide</h5>
                        <p className="text-[#71727A] text-sm">
                          117.5K Followers
                        </p>
                      </div>

                      <button className="font-semibold text-sm text-[#FF5B00] w-[4.75rem] h-[2.2rem] rounded-full border border-[#FF5B00] mt-2">
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
    </div>
  );
}
