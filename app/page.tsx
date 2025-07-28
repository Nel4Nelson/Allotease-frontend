"use client";
import React from "react";
import { HeroBanner } from "./hero-banner";
import { HomeTabs } from "@/components/features/home/home-tab";
import { FeaturedSection } from "@/components/features/home/feature-section";

export default function Home() {
  return (
    <div className="py-8 space-y-12">
      {/* Hero Banner Section */}
      <HeroBanner />

      {/* Tab Navigation with Content */}
      <HomeTabs className="container mx-auto px-4" />

      {/* Featured Hotels & Landlords Section */}
      <FeaturedSection />
    </div>
  );
}
