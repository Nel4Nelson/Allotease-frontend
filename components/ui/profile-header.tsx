"use client";
import React from "react";
import { ProfileAvatar } from "./profile-avatar";
import { ProfileName } from "./profile-name";
import { FollowingCount } from "./following-count";

interface ProfileHeaderProps {
  name: string;
  avatarUrl: string;
  followingCount: number;
  isOwnProfile?: boolean;
  onEditClick?: () => void;
  className?: string;
}

export function ProfileHeader({
  name,
  avatarUrl,
  followingCount,
  className = "",
}: ProfileHeaderProps) {
  return (
    <div className={`flex flex-col items-center gap-4 py-8 ${className}`}>
      {/* Avatar */}
      <ProfileAvatar avatarUrl={avatarUrl} name={name} size={80} />

      <div>
        <ProfileName name={name} />
        {/* Following count */}
        <FollowingCount count={followingCount} />
      </div>
    </div>
  );
}
