import React from "react";
import { ProfileAvatar } from "./profile-avatar";
import { BusinessName } from "./business-name";
import { FollowButton } from "./follow-button";

interface FollowerItemProps {
  id: string;
  name: string;
  avatarUrl: string;
  isFollowing: boolean;
  onToggleFollow?: (id: string) => void;
  onCardClick?: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function FollowerItem({
  id,
  name,
  avatarUrl,
  isFollowing,
  onToggleFollow,
  onCardClick,
  className = "",
  style,
}: FollowerItemProps) {
  const handleToggleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFollow) {
      onToggleFollow(id);
    }
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(id);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`cursor-pointer hover:bg-gray-50/50 transition-colors ${className}`}
      style={{
        borderBottom:
          "1px solid var(--Outline-on-System-Teal, rgba(138, 174, 164, 0.20))",
        display: "flex",
        padding: "8px 0",
        alignItems: "center",
        gap: "20px",
        alignSelf: "stretch",
        ...style,
      }}
    >
      {/* Avatar */}
      <ProfileAvatar avatarUrl={avatarUrl} name={name} size={35} />

      {/* Business Name */}
      <BusinessName name={name} />

      {/* Follow Button */}
      <FollowButton
        isFollowing={isFollowing}
        onToggleFollow={handleToggleFollow}
      />
    </div>
  );
}