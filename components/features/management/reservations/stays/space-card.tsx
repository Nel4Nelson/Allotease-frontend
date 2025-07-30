// components/ui/SpaceCard.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, PencilSimpleLine } from "phosphor-react";

// Define the type for extra info items
interface ExtraItem {
  text: string;
  icon: React.ElementType;
}
interface SpaceCardProps {
  title: string;
  spacesLeft: number;
  price: string;
  description: string;
  extraInfo: ExtraItem[];
}

const SpaceCard: React.FC<SpaceCardProps> = ({
  title,
  spacesLeft,
  price,
  description,
  extraInfo,
}) => {
  return (
    <div className="border rounded-xl p-4 shadow-md space-y-6 font-source">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3>{title}</h3>
        <span className="text-sm md:text-lg text-[#71727A] font-bold">
          {spacesLeft} Spaces left
        </span>
      </div>

      {/* Price */}
      <p className="text-[#1F3A3A] font-semibold bg-[#8AAEA433] px-2 py-1 rounded-md w-[120px] text-start text-base">
        {price}
      </p>

      {/* Description */}
      <p className="text-base md:text-md text-[#71727A] mb-2">{description}</p>

      {/* Extra Info */}
      <div className="space-y-2 text-base md:text-md text-[#71727A] mb-4">
        {extraInfo.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-start gap-2">
              <Icon size={16} className="text-[#15BA6B] mt-1" />
              <p>{item.text}</p>
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="border border-[#FF5B00] rounded-full font-semibold md:font-bold md:text-lg text-[#FF5B00] hover:bg-[#F2F4F780] hover:border-transparent hover:text-[#FF5B00] flex items-center gap-2"
        >
          View Reservation <ArrowUpRight size={18} />
        </Button>

        <Button className="bg-[#F2F4F799] text-[#1F2024] font-semibold md:font-bold md:text-lg hover:bg-[#F2F4F780] hover:text-[#1F2024] rounded-full flex items-center gap-2">
          Edit Space <PencilSimpleLine size={32} />
        </Button>
      </div>
    </div>
  );
};

export default SpaceCard;
