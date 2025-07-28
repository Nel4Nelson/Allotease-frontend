"use client";
import React from "react";

interface FollowButtonProps {
  isFollowing: boolean;
  onToggleFollow?: () => void;
  disabled?: boolean;
  className?: string;
}

export function FollowButton({ 
  isFollowing, 
  onToggleFollow, 
  disabled = false,
  className = "" 
}: FollowButtonProps) {
  const handleClick = () => {
    if (!disabled && onToggleFollow) {
      onToggleFollow();
    }
  };

  if (isFollowing) {
    // Following button (outline style)
    return (
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`transition-all hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        style={{
          borderRadius: '51px',
          border: '1px solid var(--Orange-Red, #FF5B00)',
          display: 'flex',
          padding: '4px 8px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
          background: 'transparent',
          color: 'var(--Orange-Red, #FF5B00)',
          fontFamily: '"Source Sans Pro"',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 600,
          lineHeight: 'normal',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      >
        Following
      </button>
    );
  }

  // Follow button (filled style)
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        borderRadius: '51px',
        background: 'var(--Orange-Red, #FF5B00)',
        display: 'flex',
        padding: '4px 8px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '15px',
        border: 'none',
        color: '#FFF',
        fontFamily: '"Source Sans Pro"',
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: 'normal',
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
    >
      Follow
    </button>
  );
}