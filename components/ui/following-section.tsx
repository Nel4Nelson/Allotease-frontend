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
  className?: string;
}

export function FollowingSection({
  followers,
  onToggleFollow,
  className = ""
}: FollowingSectionProps) {
  const handleToggleFollow = (id: string) => {
    if (onToggleFollow) {
      onToggleFollow(id);
    }
  };

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
      {followers.map((follower, index) => (
        <FollowerItem
          key={follower.id}
          id={follower.id}
          name={follower.name}
          avatarUrl={follower.avatarUrl}
          isFollowing={follower.isFollowing}
          onToggleFollow={handleToggleFollow}
          className={index === followers.length - 1 ? "border-b-0" : ""}
          style={index === followers.length - 1 ? { borderBottom: 'none' } : {}}
        />
      ))}
    </div>
  );
}