"use client";
import Image from "next/image";
import Link from "next/link";
import { Star, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Listing {
  id: string;
  title: string;
  image: string;
  date?: {
    day: string;
    time: string;
  };
  location?: string;
  status?: string;
  followersCount?: string;
  type: "stay" | "event" | "parking";
  manageUrl?: string;
}

interface ListingCardProps {
  listing: Listing;
  showManageButton?: boolean;
  className?: string;
}

export function ListingCard({
  listing,
  showManageButton = true,
  className,
}: ListingCardProps) {
  return (
    <div className={cn("max-w-[320px] w-full", className)}>
      {/* Image */}
      <div className="relative">
        <Image
          src={listing.image}
          height={200}
          width={320}
          alt={listing.title}
          className="rounded-2xl w-full h-[200px] object-cover"
        />
      </div>

      <div className="flex flex-col gap-2 mt-3">
        {/* Title */}
        <h3 className="text-[#1F2024] font-bold text-lg leading-tight">
          {listing.title}
        </h3>

        {/* Date & Time */}
        {listing.date && (
          <div className="flex items-center gap-2 text-[#71727A]">
            <Calendar size={16} />
            <p className="text-sm">
              {listing.date.day} • {listing.date.time}
            </p>
          </div>
        )}

        {/* Location */}
        {listing.location && (
          <div className="flex items-center gap-2 text-[#71727A]">
            <MapPin size={16} />
            <p className="text-sm">{listing.location}</p>
          </div>
        )}

        <hr className="border-[#E0E0E0] my-1" />

        {/* Status and Details */}
        {listing.status && (
          <div className="space-y-2">
            <p className="text-[#1F3A3A] text-sm font-medium">
              {listing.status}
            </p>

            <div className="flex items-center justify-between text-[#71727A] text-sm">
              <div className="flex items-center gap-2">
                <div className="bg-[#FF5B00] border border-[#BC4300] h-[14px] w-[14px] rounded-full flex items-center justify-center">
                  <Star size={8} className="text-white fill-current" />
                </div>
                <span>{listing.location}</span>
              </div>

              {listing.followersCount && (
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{listing.followersCount}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Manage Button */}
        {showManageButton && (
          <div className="mt-3">
            <Button
              asChild
              variant="outline"
              className="w-full bg-[#F2F4F799] hover:bg-[#F2F4F7] border-transparent text-[#1F2024] font-bold rounded-full"
            >
              <Link href={listing.manageUrl || "#"}>Manage</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
