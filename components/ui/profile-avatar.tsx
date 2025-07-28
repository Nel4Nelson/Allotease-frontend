import React from "react";
import { FallbackImage } from "./fallback-image";

interface ProfileAvatarProps {
  avatarUrl: string;
  name: string;
  size?: number;
  className?: string;
}

export function ProfileAvatar({ 
  avatarUrl, 
  name, 
  size = 80, 
  className = "" 
}: ProfileAvatarProps) {
  return (
    <div 
      className={`flex-shrink-0 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <FallbackImage
        src={avatarUrl}
        fallbackSrc="/icons/encircle-star-green-avatar.svg"
        alt={`${name} profile picture`}
        fallbackAlt="Default profile avatar"
        width={size}
        height={size}
        className="object-contain"
      />
    </div>
  );
}