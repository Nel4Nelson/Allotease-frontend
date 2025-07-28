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
  className?: string;
  style?: React.CSSProperties;
}

export function FollowerItem({
  id,
  name,
  avatarUrl,
  isFollowing,
  onToggleFollow,
  className = "",
  style, // Add this parameter
}: FollowerItemProps) {
  const handleToggleFollow = () => {
    if (onToggleFollow) {
      onToggleFollow(id);
    }
  };

  return (
    <div
      className={className}
      style={{
        borderBottom:
          "1px solid var(--Outline-on-System-Teal, rgba(138, 174, 164, 0.20))",
        display: "flex",
        padding: "8px 0",
        alignItems: "center",
        gap: "20px",
        alignSelf: "stretch",
        ...style, // Merge with any passed style prop
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