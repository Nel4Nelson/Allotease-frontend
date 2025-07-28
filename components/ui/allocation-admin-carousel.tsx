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
      emblaApi.scrollNext();
      
      // Check if we're near the end and need to load more
      if (hasMore && !isLoadingMore && onLoadMore) {
        const slidesInView = emblaApi.slidesInView();
        const slideNodes = emblaApi.slideNodes();
        const lastSlideIndex = slideNodes.length - 1;
        const isNearEnd = slidesInView.includes(lastSlideIndex - 1) || slidesInView.includes(lastSlideIndex);
        
        if (isNearEnd) {
          onLoadMore();
        }
      }
    }
  }, [emblaApi, hasMore, isLoadingMore, onLoadMore]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

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