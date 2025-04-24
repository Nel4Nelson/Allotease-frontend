import React from "react";
import Image from "next/image";
import { EventCardListProps } from "@/types/home/EventTypes.ts";

export const EventCardList: React.FC<EventCardListProps> = ({
  events,
  flexRow,
}) => {
  return (
    <>
      {events.map((list, i) => (
        <div
          key={i}
          className={`${
            flexRow
              ? "flex flex-col justify-start gap-4 items-center lg:flex-row"
              : " max-w-[320px]"
          }`}
        >
          <Image
            src={list.imgLink}
            height={70}
            width={300}
            alt={list.imgAlt}
            className="rounded-2xl"
          />

          <div className="flex flex-col md:gap-4 ">
            <h3 className="text-[#1F2024] font-bold text-lg my-2">
              {list.title}
            </h3>
            <p className="text-[#71727A]">
              {list.date.day} • {list.date.time}
            </p>

            <hr className="#E0E0E0 my-2" />

            <div className="text-xs font-source">
              <p className="text-[#1F3A3A]">{list.status}</p>
              <div className="text-[#71727A] flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="bg-[#FF5B00] border border-[#BC4300] h-[14px] w-[14px] rounded-full flex items-center justify-center p-[1px]">
                    <Image
                      src="/icons/star.svg"
                      height={10}
                      width={10}
                      alt="star icon"
                      className="object-contain"
                    />
                  </div>
                  <p>{list.location}</p>
                </div>

                <p>{list.followersCount}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
