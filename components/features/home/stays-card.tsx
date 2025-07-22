"use client";
import React from "react";
import Image from "next/image";
import { Stay } from "@/services/stays-service";

interface StayCardProps {
  stay: Stay;
}

export function StayCard({ stay }: StayCardProps) {
  const { title, location, description, images, accomodationType } = stay;
  
  // Placeholder image if no images available
  const imageUrl = images[0] || "/images/placeholder-stay.jpg";
  
  // Generate mock rating for demonstration
  const rating = (4.0 + Math.random()).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 500) + 100;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative w-full h-44 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          style={{
            borderRadius: '24px 24px 0 0'
          }}
        />
      </div>

      {/* Content Container */}
      <div className="p-6" style={{ marginTop: '24px' }}>
        {/* Title */}
        <h3 
          className="font-space-grotesk font-bold mb-2"
          style={{
            color: 'var(--title-color)',
            fontSize: '18px',
            fontWeight: 700,
            lineHeight: '140%',
            letterSpacing: '-0.36px'
          }}
        >
          {title}
        </h3>

        {/* Location */}
        <p 
          className="font-source-sans mb-3"
          style={{
            color: 'var(--body-text)',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '142.745%',
            letterSpacing: '-0.32px'
          }}
        >
          {location.city}, {location.state}, {location.country}
        </p>

        {/* Rating Badge and Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div 
            className="flex items-center justify-center"
            style={{
              height: '24px',
              padding: '8px',
              gap: '4px',
              borderRadius: '12px',
              border: '2px solid #93FFC2',
              background: '#13C962'
            }}
          >
            <span className="text-white text-sm font-medium">{rating}</span>
          </div>
          <span 
            className="font-source-sans"
            style={{
              color: 'var(--body-text)',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '142.745%',
              letterSpacing: '-0.28px'
            }}
          >
            {reviewCount} reviews
          </span>
        </div>

        {/* Description */}
        <p 
          className="font-source-sans mb-4"
          style={{
            overflow: 'hidden',
            color: 'var(--body-text)',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '142.745%',
            letterSpacing: '-0.32px'
          }}
        >
          {description}
        </p>

        {/* Make Reservation Button */}
        <button 
          className="w-full font-source-sans transition-all duration-200 hover:bg-gray-200/80"
          style={{
            display: 'flex',
            padding: '6px 12px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px',
            borderRadius: '51px',
            background: 'rgba(242, 244, 247, 0.60)',
            backdropFilter: 'blur(21px)',
            color: 'var(--title-color)',
            fontSize: '18px',
            fontWeight: 600,
            lineHeight: 'normal'
          }}
        >
          Make a reservation
        </button>
      </div>
    </div>
  );
}