"use client";
import React from "react";
import { UserProfileCard } from "./user-profile-card";
import { TicketsSection } from "./tickets-section";
import { useUserProfile } from "@/hooks/use-user-profile";

export function TicketsLayout() {
  const { profile, followedOrganizers, toggleFollowOrganizer } =
    useUserProfile();

  return (
    <div className="px-4 md:px-8 py-4 md:py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="md:col-span-1 flex flex-col items-center md:items-start">
          <div className="w-full">
            <UserProfileCard
              profile={profile}
              followedOrganizers={followedOrganizers}
              onToggleFollow={toggleFollowOrganizer}
            />
          </div>
        </div>

        {/* Tickets Section */}
        <div className="md:col-span-2">
          <TicketsSection />
        </div>
      </div>
    </div>
  );
}
