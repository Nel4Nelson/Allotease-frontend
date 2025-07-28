"use client";
import { useEffect } from "react";
import { ProfileHeader } from "@/components/ui/profile-header";
import { FollowingSection } from "@/components/ui/following-section";
import { useProfileStore } from "@/stores/profile-store";

interface TicketsLayoutProps {
  children: React.ReactNode;
}

export default function TicketsLayout({ children }: TicketsLayoutProps) {
  const {
    profile,
    isLoading,
    error,
    fetchProfile,
    getFullName,
    getFollowingCount,
    getAvatarUrl
  } = useProfileStore();

  // Mock followers data for now - will replace with API integration
  const mockFollowers = [
    {
      id: "1",
      name: "Flend Worldwide",
      avatarUrl: "/icons/encircle-star-green-avatar.svg",
      isFollowing: true
    },
    {
      id: "2", 
      name: "Flend Worldwide",
      avatarUrl: "/icons/encircle-star-green-avatar.svg",
      isFollowing: false
    },
    {
      id: "3",
      name: "Flend Worldwide",
      avatarUrl: "/icons/encircle-star-green-avatar.svg",
      isFollowing: true
    },
    {
      id: "4",
      name: "Flend Worldwide", 
      avatarUrl: "/icons/encircle-star-green-avatar.svg",
      isFollowing: true
    },
    {
      id: "5",
      name: "Flend Worldwide",
      avatarUrl: "/icons/encircle-star-green-avatar.svg",
      isFollowing: true
    },
    {
      id: "6",
      name: "Flend Worldwide",
      avatarUrl: "/icons/encircle-star-green-avatar.svg",
      isFollowing: true
    }
  ];

  // Fetch profile on component mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);


  const handleToggleFollow = (followerId: string) => {
    console.log("Toggle follow for:", followerId);
    // TODO: Implement follow/unfollow functionality
  };

  // Show loading skeleton or error state if needed
  if (isLoading && !profile) {
    return (
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-2">
          <div className="flex flex-col items-center gap-4 py-8">
            {/* Loading skeleton */}
            <div className="w-20 h-20 bg-gray-300 rounded-full animate-pulse" />
            <div className="w-32 h-6 bg-gray-300 rounded animate-pulse" />
            <div className="w-24 h-4 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
        <div className="col-span-3">{children}</div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-2">
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="text-red-500 text-center">
              <p>Failed to load profile</p>
              <button 
                onClick={() => fetchProfile()}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-3">{children}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-6">
      {/* Left Column - 40% (2/5) */}
      <div className="col-span-2 space-y-2">
        <ProfileHeader
          name={getFullName()}
          avatarUrl={getAvatarUrl()}
          followingCount={getFollowingCount()}
        />
        
        <FollowingSection
          followers={mockFollowers}
          onToggleFollow={handleToggleFollow}
        />
      </div>

      {/* Right Column - 60% (3/5) */}
      <div className="col-span-3">{children}</div>
    </div>
  );
}