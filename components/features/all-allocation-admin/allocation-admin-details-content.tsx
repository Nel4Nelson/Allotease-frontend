"use client";
import React from "react";

import { NetworkError } from "@/components/ui/network-error";
import { AllocatorService } from "@/services/allocator-service";
import { AllocationAdminDetailsSkeleton } from "@/components/ui/loading-skeletons/allocation-admin-details-skeleton";
import { AllocationAdminBanner } from "./allocation-admin-banner";
import { AllocationAdminInfo } from "./allocation-admin-info";
import { AllocationAdminTabs } from "./allocation-admin-tabs";
import { StayDetailsGuestReviews } from "@/components/ui/stay-details/stay-details-guest-reviews";
import { useAllocatorProfile } from "@/hooks/useAllocatorProfile";
import { BackButton } from "../auth/shared/back-button";


interface AllocationAdminDetailsContentProps {
    allocatorId: string;
}

export function AllocationAdminDetailsContent({ allocatorId }: AllocationAdminDetailsContentProps) {
    // Fetch allocator profile data
    const {
        data: profileData,
        isLoading,
        isError,
        refetch,
    } = useAllocatorProfile(allocatorId);

    // Loading state
    if (isLoading) {
        return <AllocationAdminDetailsSkeleton />;
    }

    // Error state
    if (isError || !profileData) {
        return (
            <div className="p-6 space-y-6">
                <NetworkError
                    message="Unable to load allocation admin details"
                    onRetry={refetch}
                />
            </div>
        );
    }

    const allocator = profileData.data;

    // Prepare data for components
    const profileInfo = {
        name: AllocatorService.formatAllocatorName(allocator),
        followerCount: AllocatorService.formatFollowerCount(allocator.followersCount),
        avatarUrl: allocator.avatar || "/icons/encircle-star-orange-avatar.svg",
    };

    return (
        <div className="p-6 space-y-10">
            {/* Banner with Info hanging at the bottom */}
            <div className="relative mb-[170px]">
                <div className="flex items-center mb-4">
                    <BackButton />
                </div>
                {/* Banner */}
                <AllocationAdminBanner />

                {/* Info Section - Positioned absolutely relative to banner */}
                <AllocationAdminInfo
                    name={profileInfo.name}
                    followerCount={profileInfo.followerCount}
                    avatarUrl={profileInfo.avatarUrl}
                />
            </div>

            {/* Tabs with Spaces and Events */}
            <AllocationAdminTabs allocatorId={allocatorId} />

            {/* Guest Reviews Section */}
            <StayDetailsGuestReviews ownerId={allocatorId} />
        </div>
    );
}