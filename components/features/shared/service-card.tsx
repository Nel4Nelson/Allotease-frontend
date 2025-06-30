'use client';
import React from 'react';
import Image from 'next/image';
import { ServiceCardProps } from '@/types';

export function ServiceCard({ items, variant = 'grid' }: ServiceCardProps) {
  if (items.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="text-[#71727A]">
          <svg
            className="mx-auto h-12 w-12 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-lg font-medium">No items available</p>
          <p className="text-sm">Check back later for new listings</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {items.map((item) => (
        <article
          key={item.id}
          className={`cursor-pointer hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden bg-white border border-gray-100 ${
            variant === 'list'
              ? 'flex flex-col lg:flex-row gap-4 items-start p-4'
              : 'max-w-[320px]'
          }`}
        >
          <div className="relative">
            <Image
              src={item.image.src}
              height={variant === 'list' ? 120 : 200}
              width={300}
              alt={item.image.alt}
              className="rounded-2xl object-cover w-full"
            />
            {item.pricing.type === 'free' && (
              <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Free
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 flex-1 p-4">
            <h3 className="text-[#1F2024] font-bold text-lg line-clamp-2 hover:text-[#FF5B00] transition-colors">
              {item.title}
            </h3>
            
            <p className="text-[#71727A] text-sm flex items-center gap-1">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM128,64a8,8,0,0,1,8,8v56l40,40a8,8,0,0,1-11.31,11.31L123.31,138A8,8,0,0,1,120,132V72A8,8,0,0,1,128,64Z"/>
              </svg>
              {item.date.day} • {item.date.time}
            </p>

            <hr className="border-[#E0E0E0] my-2" />

            <div className="text-xs space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[#1F3A3A] font-medium capitalize">
                  {item.pricing.type}
                  {item.pricing.amount && (
                    <span className="text-[#FF5B00] font-bold ml-1">
                      {item.pricing.currency}{item.pricing.amount}
                    </span>
                  )}
                </p>
                <p className="text-[#71727A] text-xs">{item.location.city}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="bg-[#FF5B00] border border-[#BC4300] h-[14px] w-[14px] rounded-full flex items-center justify-center">
                    {item.provider.verified ? (
                      <svg width="8" height="8" fill="white" viewBox="0 0 256 256">
                        <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/>
                      </svg>
                    ) : (
                      <Image
                        src="/icons/star.svg"
                        height={8}
                        width={8}
                        alt="Provider icon"
                        className="object-contain"
                      />
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.provider.name}</span>
                </div>
                <span className="text-xs text-[#71727A]">
                  {item.provider.followersCount} Followers
                </span>
              </div>
            </div>
          </div>
        </article>
      ))}
    </>
  );
}