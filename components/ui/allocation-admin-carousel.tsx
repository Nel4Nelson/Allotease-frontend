"use client";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { AllocationAdminCard } from "./allocation-admin-card";
import { LeftArrowIcon, RightArrowIcon } from "../icons";

interface AllocationAdminProfile {
  id: string;
  name: string;
  followerCount: string;
  avatarUrl: string;
  isFollowing?: boolean;
}

interface AllocationAdminCarouselProps {
  profiles: AllocationAdminProfile[];
  onFollowClick?: (id: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  className?: string;
}

export function AllocationAdminCarousel({
  profiles,
  onFollowClick,
  onLoadMore,
  hasMore,
  isLoadingMore,
  className = ""
}: AllocationAdminCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    skipSnaps: false,
    breakpoints: {
      '(min-width: 768px)': { 
        slidesToScroll: 4 // Show 4 cards at once on desktop
      }
    }
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      // If we can scroll within current items, just scroll
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } 
      // If we can't scroll but there's more data, load more
      else if (hasMore && !isLoadingMore && onLoadMore) {
        onLoadMore();
      }
      
      // Check if we need to load more data when scrolling
      const slidesInView = emblaApi.slidesInView();
      const slideNodes = emblaApi.slideNodes();
      const lastSlideIndex = slideNodes.length - 1;
      const isNearEnd = slidesInView.includes(lastSlideIndex - 1) || slidesInView.includes(lastSlideIndex);
      
      if (isNearEnd && hasMore && !isLoadingMore && onLoadMore) {
        onLoadMore();
      }
    }
  }, [emblaApi, hasMore, isLoadingMore, onLoadMore]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    
    setCanScrollPrev(emblaApi.canScrollPrev());
    
    // Can scroll next if:
    // 1. Embla can scroll within current items, OR
    // 2. There's more data available to load
    const emblaCanScrollNext = emblaApi.canScrollNext();
    const hasMoreData = Boolean(hasMore && !isLoadingMore);
    setCanScrollNext(emblaCanScrollNext || hasMoreData);
  }, [emblaApi, hasMore, isLoadingMore]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  // Update navigation state when hasMore or isLoadingMore changes
  useEffect(() => {
    onSelect();
  }, [hasMore, isLoadingMore, onSelect]);

  return (
    <div className={`relative ${className}`} style={{ }}>
      {/* Left Navigation - Absolute positioned */}
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 transition-all hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          borderRadius: '51px',
          border: '1px solid var(--Orange-Red, #FF5B00)',
          display: 'flex',
          padding: '12px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
          background: 'white',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <LeftArrowIcon />
      </button>

      {/* Carousel Container - Full width */}
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex gap-6">
          {profiles.map((profile) => (
            <div key={profile.id} className="flex-none" style={{ width: '222px' }}>
              <AllocationAdminCard
                id={profile.id}
                name={profile.name}
                followerCount={profile.followerCount}
                avatarUrl={profile.avatarUrl}
                isFollowing={profile.isFollowing}
                onFollowClick={onFollowClick}
              />
            </div>
          ))}
          
          {/* Loading indicator for when more items are being loaded */}
          {isLoadingMore && (
            <div className="flex-none" style={{ width: '222px' }}>
              <div className="flex flex-col justify-center items-center h-[290px] animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Navigation - Absolute positioned */}
      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 transition-all hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          borderRadius: '51px',
          border: '1px solid var(--Orange-Red, #FF5B00)',
          display: 'flex',
          padding: '12px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
          background: 'white',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <RightArrowIcon />
      </button>
    </div>
  );
}