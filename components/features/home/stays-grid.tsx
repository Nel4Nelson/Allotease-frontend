"use client";
import React, { useState, useEffect } from "react";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { StayCard } from "./stays-card";
import { StaysService, Stay } from "@/services/stays-service";

interface StaysGridProps {
  accommodationType?: string;
}

// Loading skeleton card component
function StayCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
      {/* Image Container */}
      <div className="relative w-full h-44 overflow-hidden">
        <Skeleton 
          height={176} 
          style={{ borderRadius: '24px 24px 0 0' }} 
        />
      </div>

      {/* Content Container */}
      <div className="p-6" style={{ marginTop: '24px' }}>
        {/* Title */}
        <div className="mb-2">
          <Skeleton height={25} width="75%" />
        </div>

        {/* Location */}
        <div className="mb-3">
          <Skeleton height={16} width="60%" />
        </div>

        {/* Rating Badge and Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <Skeleton height={24} width={50} borderRadius={12} />
          <Skeleton height={14} width={80} />
        </div>

        {/* Description */}
        <div className="mb-4">
          <Skeleton height={16} width="100%" />
        </div>

        {/* Make Reservation Button */}
        <Skeleton 
          height={36} 
          width="100%" 
          borderRadius={51}
        />
      </div>
    </div>
  );
}

export function StaysGrid({ accommodationType = "apartments" }: StaysGridProps) {
  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStays();
  }, [accommodationType]);

  const fetchStays = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await StaysService.getStaysByType(accommodationType, 1, 10);
      
      if (response.status === 'success') {
        setStays(response.data.items);
      } else {
        setError('Failed to fetch stays');
      }
    } catch (error) {
      console.error('Error fetching stays:', error);
      setError('Failed to fetch stays');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <div>
              <Skeleton height={32} width={350} className="mb-2" />
              <div className="flex items-center gap-2 mt-2">
                <Skeleton circle height={8} width={8} />
                <Skeleton height={14} width={120} />
              </div>
            </div>
            <Skeleton height={20} width={150} />
          </div>
          
          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <StayCardSkeleton key={item} />
            ))}
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-space-grotesk font-semibold text-gray-900">
            Available accommodation near you
          </h2>
        </div>
        
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchStays}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-space-grotesk font-semibold text-gray-900">
            Available accommodation near you
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Awka, Anambra</span>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Type: Hotels & Lodging
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stays.map((stay) => (
          <StayCard key={stay._id} stay={stay} />
        ))}
      </div>

      {/* Show More Button */}
      {stays.length > 0 && (
        <div className="text-center pt-6">
          <button className="text-orange-500 font-medium hover:text-orange-600 transition-colors">
            Show more
          </button>
        </div>
      )}
    </div>
  );
}