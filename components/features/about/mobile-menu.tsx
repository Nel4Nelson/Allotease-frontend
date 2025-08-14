"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "@/components/icons";
import { useAuthStore } from "@/stores/auth-store";
import { useProfileStore } from "@/stores/profile-store";
import { FallbackImage } from "@/components/ui/fallback-image";
import { useEffect } from "react";

interface AboutMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutMobileMenu({ isOpen, onClose }: AboutMobileMenuProps) {
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
    <div
      className={`md:hidden absolute top-full left-0 w-full glass-effect-strong transition-all duration-500 ease-in-out ${
        isOpen
          ? "opacity-100 max-h-[400px] py-6 px-4"
          : "opacity-0 max-h-0 overflow-hidden"
      }`}
    >
      <nav
        className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto"
        role="navigation"
      >
        {/* Explore Resources Link */}
        <Link href="/" onClick={onClose} className="w-full">
          <div className="flex items-center justify-center gap-2 group relative font-source-sans-pro font-semibold text-lg text-white/80 hover:text-white transition-all duration-300 py-3 px-4 rounded-lg hover:bg-white/5">
            <span className="relative">
              Explore Resources
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300"></span>
            </span>
            <ArrowUpRightIcon
              size={18}
              className="text-white/60 group-hover:text-white transition-colors duration-300 flex-shrink-0"
            />
          </div>
        </Link>

        {/* Conditional Sign In / User Profile */}
        {isAuthenticated && displayName ? (
          /* User Profile Section */
          <Link href="/tickets" onClick={onClose} className="w-full max-w-[250px]">
            <div className="flex items-center justify-center gap-3 px-4 py-3 rounded-[10px] bg-white/10 backdrop-blur-[21px] border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group shadow-btn-glass hover:shadow-btn-glass-hover w-full">
              {/* Avatar */}
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
                <FallbackImage
                  src={avatarUrl}
                  fallbackSrc="/icons/encircle-star-green-avatar.svg"
                  alt="User avatar"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              
              {/* User Name */}
              <span className="font-source-sans-pro font-semibold text-base text-white/90 group-hover:text-white transition-colors duration-300 text-shadow-glass text-center flex-1">
                {displayName}
              </span>
              
              {/* Subtle Arrow */}
              <ArrowUpRightIcon
                size={16}
                className="text-white/60 group-hover:text-white/80 transition-colors duration-300 flex-shrink-0"
              />
            </div>
          </Link>
        ) : (
          /* Sign In Button */
          <Link href="/signin" onClick={onClose} className="w-full max-w-[200px]">
            <Button
              variant="allotease-glass"
              size="allotease-md"
              className="w-full"
              aria-label="Sign in to your account"
            >
              Sign In
            </Button>
          </Link>
        )}
      </nav>
    </div>
  );
}