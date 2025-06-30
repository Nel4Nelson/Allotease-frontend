import FollowCard from "@/components/layout/FollowCard";
import Image from "next/image";
import React from "react";

const Categories = () => {
  return (
    <div className="p-4 md:p-8 lg:max-w-[60%]">
      <div className="">
        <h3 className="text-[#1F2024] font-bold text-xl">Categories</h3>

        <div className="flex flex-wrap gap-5 py-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="flex gap-2 bg-[#F2F4F7] py-2 px-3 rounded-full"
            >
              <Image
                src="/icons/arrowright.svg"
                height={16}
                width={16}
                alt="arrow icon"
              />
              <p className="text-sm font-source text-[#20232A] wrap-none">
                Nigerian events
              </p>
            </div>
          ))}
        </div>

        <FollowCard />
      </div>
    </div>
  );
};

export default Categories;
