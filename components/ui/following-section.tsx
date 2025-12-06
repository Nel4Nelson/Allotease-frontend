"use client";
import React from "react";
import { FollowerItem } from "./follower-item";

interface FollowerProfile {
  id: string;
  name: string;
  avatarUrl: string;
  isFollowing: boolean;
}

interface FollowingSectionProps {
  followers: FollowerProfile[];
  onToggleFollow?: (id: string) => void;
  onCardClick?: (id: string) => void;
  className?: string;
}

export function FollowingSection({
  followers,
  onToggleFollow,
  onCardClick,
  className = ""
}: FollowingSectionProps) {
  const handleToggleFollow = (id: string) => {
    if (onToggleFollow) {
      onToggleFollow(id);
    }
  };

  const handleCardClick = (id: string) => {
    if (onCardClick) {
      onCardClick(id);
    }
  };

  // Deduplicate followers to prevent duplicate keys
  const uniqueFollowers = followers.filter((follower, index, array) => 
    array.findIndex(f => f.id === follower.id) === index
  );

  return (
    <div 
      className={className}
      style={{
        display: 'flex',
        padding: '8px 16px',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '4px',
        flex: '1 0 0',
        alignSelf: 'stretch',
        borderRadius: '8px',
        border: '1px solid var(--Outline-on-System-Teal, rgba(138, 174, 164, 0.20))',
        background: 'rgba(242, 244, 247, 0.30)'
      }}
    >
      {uniqueFollowers.map((follower, index) => (
        <FollowerItem
          key={`${follower.id}-${index}`}
          id={follower.id}
          name={follower.name}
          avatarUrl={follower.avatarUrl}
          isFollowing={follower.isFollowing}
          onToggleFollow={handleToggleFollow}
          onCardClick={handleCardClick}
          className={index === uniqueFollowers.length - 1 ? "border-b-0" : ""}
          style={index === uniqueFollowers.length - 1 ? { borderBottom: 'none' } : {}}
        />
      ))}
    </div>
  );
}