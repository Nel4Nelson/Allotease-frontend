"use client";
import { currentLocation } from "@/data";
import React from "react";

export function LocationSelector() {
  return (
    <div className="flex items-center gap-2 text-[#1F2024] cursor-pointer hover:text-[#FF5B00] transition-colors">
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
        <path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z" />
      </svg>
      <span className="font-medium text-sm md:text-base">
        {currentLocation.city}, {currentLocation.state}
      </span>
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
        <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
      </svg>
    </div>
  );
}
