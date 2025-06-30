"use client";
import React from "react";
import Image from "next/image";
import { EventCategoriesProps } from "@/types/event-details";
import { useFollowOrganizer } from "@/hooks/use-follow-organizer";

function OrganizerCard({
  organizer,
  onFollowToggle,
}: {
  organizer: EventCategoriesProps["organizer"];
  onFollowToggle: EventCategoriesProps["onFollowToggle"];
}) {
  const { isFollowing, isLoading, toggleFollow } =
    useFollowOrganizer(organizer);

  const handleToggleFollow = async () => {
    await toggleFollow();
    onFollowToggle(organizer.id);
  };

  return (
    <div className="bg-[#F2F4F7] rounded-lg px-4 py-3 w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px] rounded-full bg-[#FF5B00] border-2 border-[#BC4300] flex items-center justify-center">
            <Image
              src={organizer.avatar || "/icons/star.svg"}
              alt={`${organizer.name} avatar`}
              width={24}
              height={24}
              className="object-contain"
            />
          </div>

          <div>
            <h5 className="font-bold text-sm md:text-base text-[#1F2024] flex items-center gap-1">
              {organizer.name}
              {organizer.isVerified && (
                <svg
                  width="16"
                  height="16"
                  fill="#3B82F6"
                  viewBox="0 0 256 256"
                >
                  <path d="M225.86,102.82c-3.77-3.94-5.7-9.62-5.7-16.82s1.93-12.88,5.7-16.82L236.32,57.73a8,8,0,0,0-.3-11.31L224.58,35.17a8,8,0,0,0-11.31-.3L201.82,46.14c-3.94,3.77-9.62,5.7-16.82,5.7s-12.88-1.93-16.82-5.7L156.73,34.68a8,8,0,0,0-11.31.3L134.17,46.42a8,8,0,0,0-.3,11.31l11.27,11.45c3.77,3.94,5.7,9.62,5.7,16.82s-1.93,12.88-5.7,16.82L133.87,114.27a8,8,0,0,0,.3,11.31l11.25,11.25a8,8,0,0,0,11.31.3l11.45-11.27c3.94-3.77,9.62-5.7,16.82-5.7s12.88,1.93,16.82,5.7l11.45,11.27a8,8,0,0,0,11.31-.3l11.25-11.25a8,8,0,0,0,.3-11.31ZM196,140a36,36,0,1,1,36-36A36,36,0,0,1,196,140Z" />
                </svg>
              )}
            </h5>
            <p className="text-[#71727A] text-xs md:text-sm">
              {organizer.followersCount} Followers
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleFollow}
          disabled={isLoading}
          className={`font-semibold text-xs md:text-sm px-3 py-2 rounded-full border transition-colors disabled:opacity-50 ${
            isFollowing
              ? "text-[#FF5B00] border-[#FF5B00] bg-white hover:bg-orange-50"
              : "text-white bg-[#FF5B00] border-[#FF5B00] hover:bg-[#E04E00]"
          }`}
        >
          {isLoading ? "..." : isFollowing ? "Following" : "Follow"}
        </button>
      </div>
    </div>
  );
}

export function EventCategories({
  categories,
  organizer,
  onFollowToggle,
}: EventCategoriesProps) {
  return (
    <div className="py-6 lg:max-w-[60%]">
      <h3 className="text-[#1F2024] font-bold text-xl mb-4">Categories</h3>

      {/* Category Tags */}
      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center gap-2 bg-[#F2F4F7] hover:bg-gray-200 py-2 px-3 rounded-full transition-colors cursor-pointer"
          >
            <Image
              src="/icons/arrowright.svg"
              height={16}
              width={16}
              alt="Category icon"
            />
            <span className="text-sm text-[#20232A] whitespace-nowrap">
              {category.name}
            </span>
          </div>
        ))}
      </div>

      {/* Organizer Card */}
      <OrganizerCard organizer={organizer} onFollowToggle={onFollowToggle} />
    </div>
  );
}
