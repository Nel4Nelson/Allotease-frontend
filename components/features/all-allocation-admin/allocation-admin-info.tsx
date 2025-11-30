"use client";
import React from "react";
import { FallbackImage } from "@/components/ui/fallback-image";

interface AllocationAdminInfoProps {
    name: string;
    followerCount: string;
    avatarUrl?: string;
}

export function AllocationAdminInfo({
    name,
    followerCount,
    avatarUrl = "/icons/encircle-star-orange-avatar.svg",
}: AllocationAdminInfoProps) {
    return (
        <div className="absolute -bottom-[150px] left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <FallbackImage
                        src={avatarUrl}
                        fallbackSrc="/icons/encircle-star-orange-avatar.svg"
                        alt={`${name} avatar`}
                        fallbackAlt="Default avatar"
                        width={120}
                        height={120}
                        className="rounded-full"
                    />
                </div>

                {/* Name and Follower Count - 40px gap from avatar */}
                <div className="flex flex-col items-center mt-[40px]">
                    {/* Name */}
                    <h2
                        style={{
                            color: "var(--Title, #1F2024)",
                            fontFamily: "var(--font-space-grotesk), sans-serif",
                            fontSize: "24px",
                            fontStyle: "normal",
                            fontWeight: 700,
                            lineHeight: "140%",
                            letterSpacing: "-0.48px",
                            margin: 0,
                            textAlign: "center",
                        }}
                    >
                        {name}
                    </h2>

                    {/* Follower Count - 1px gap from name */}
                    <p
                        className="mt-[1px]"
                        style={{
                            color: "var(--Body, #71727A)",
                            fontFamily: "var(--font-source-sans), sans-serif",
                            fontSize: "18px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "142.745%",
                            letterSpacing: "-0.36px",
                            margin: 0,
                            textAlign: "center",
                        }}
                    >
                        {followerCount}
                    </p>
                </div>
            </div>
        </div>
    );
}