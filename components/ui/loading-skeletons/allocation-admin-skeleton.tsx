"use client";
import React from "react";

interface AllocationAdminSkeletonProps {
    className?: string;
}

export function AllocationAdminSkeleton({
    className = "",
}: AllocationAdminSkeletonProps) {
    return (
        <div
            className={`flex flex-col justify-center items-center flex-shrink-0 animate-pulse ${className}`}
            style={{
                display: "flex",
                width: "222px",
                height: "290px",
                minWidth: "200px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
                flexShrink: 0,
                borderRadius: "20px",
                background: "#F2F4F7",
            }}
        >
            {/* Avatar Skeleton */}
            <div
                className="rounded-full bg-gray-300"
                style={{
                    width: "80px",
                    height: "80px",
                    flexShrink: 0,
                }}
            />

            {/* Name Skeleton */}
            <div
                className="bg-gray-300 rounded"
                style={{
                    width: "140px",
                    height: "20px",
                }}
            />

            {/* Follower Count Skeleton */}
            <div
                className="bg-gray-300 rounded"
                style={{
                    width: "100px",
                    height: "16px",
                }}
            />

            {/* Buttons Skeleton */}
            <div className="flex items-center gap-2">
                <div
                    className="bg-gray-300 rounded-full"
                    style={{
                        width: "70px",
                        height: "32px",
                    }}
                />
                <div
                    className="bg-gray-300 rounded-full"
                    style={{
                        width: "80px",
                        height: "32px",
                    }}
                />
            </div>
        </div>
    );
}

interface AllocationAdminGridSkeletonProps {
    count?: number;
}

export function AllocationAdminGridSkeleton({
    count = 12,
}: AllocationAdminGridSkeletonProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {Array.from({ length: count }).map((_, index) => (
                <AllocationAdminSkeleton key={index} />
            ))}
        </div>
    );
}