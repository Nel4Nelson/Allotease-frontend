"use client";
import React from "react";

export function AllocationAdminDetailsSkeleton() {
  return (
    <div className="p-6 space-y-10 animate-pulse">
      {/* Banner Skeleton */}
      <div className="relative mb-[170px]">
        <div className="h-[221px] rounded-2xl bg-gray-200" />
        
        {/* Avatar Skeleton */}
        <div className="absolute -bottom-[150px] left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center gap-[40px]">
            <div className="w-[120px] h-[120px] rounded-full bg-gray-300" />
            <div className="space-y-2">
              <div className="w-[200px] h-[28px] bg-gray-300 rounded mx-auto" />
              <div className="w-[120px] h-[20px] bg-gray-200 rounded mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="w-[100px] h-[40px] bg-gray-200 rounded" />
          <div className="w-[100px] h-[40px] bg-gray-200 rounded" />
        </div>
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-[300px] bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}