"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "@/components/icons";
import { useAuthStore } from "@/stores/auth-store";
import { useProfileStore } from "@/stores/profile-store";
import { FallbackImage } from "@/components/ui/fallback-image";
import { useEffect } from "react";

export function AboutDesktopNav() {
  const { isAuthenticated, user } = useAuthStore();
  const { profile, fetchProfile, getFullName, getAvatarUrl } = useProfileStore();

  // Fetch profile when user is authenticated but profile is not loaded
  useEffect(() => {
    if (isAuthenticated && !profile) {
      fetchProfile();
    }
  }, [isAuthenticated, profile, fetchProfile]);

  const displayName = profile ? getFullName() : user ? `${user.firstname} ${user.lastname}`.trim() : '';
  const avatarUrl = profile ? getAvatarUrl() : "/icons/encircle-star-green-avatar.svg";

  return (
    <nav className="hidden md:flex items-center gap-8">
      {/* Explore Resources Button */}
      <Link href="/">
        <span className="flex items-center gap-1 group relative font-source-sans-pro font-semibold text-base text-white/60 group-hover:text-white transition-all duration-300">
          <span className="relative">
            Explore Resources
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"></span>
          </span>
          <ArrowUpRightIcon
            size={16}
            className="text-white/60 group-hover:text-white transition-colors duration-300"
          />
        </span>
      </Link>

      {/* Conditional Sign In / User Profile */}
      {isAuthenticated && displayName ? (
        /* User Profile Section */
        <Link href="/tickets">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-[10px] bg-white/10 backdrop-blur-[21px] border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group shadow-btn-glass hover:shadow-btn-glass-hover">
            {/* Avatar */}
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/20">
              <FallbackImage
                src={avatarUrl}
                fallbackSrc="/icons/encircle-star-green-avatar.svg"
                alt="User avatar"
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            
            {/* User Name */}
            <span className="font-source-sans-pro font-semibold text-sm text-white/90 group-hover:text-white transition-colors duration-300 text-shadow-glass">
              {displayName}
            </span>
            
            {/* Subtle Arrow */}
            <ArrowUpRightIcon
              size={14}
              className="text-white/60 group-hover:text-white/80 transition-colors duration-300"
            />
          </div>
        </Link>
      ) : (
        /* Sign In Button */
        <Link href="/signin">
          <Button
            variant="allotease-glass"
            size="allotease-sm"
            aria-label="Sign in to your account"
          >
            Sign In
          </Button>
        </Link>
      )}
    </nav>
  );
}