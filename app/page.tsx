/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { StaysGrid } from "@/components/features/home/stays-grid";
import { HeroBanner } from "./hero-banner";
import { TabNavigation } from "@/components/features/home/tab-navigation";
import { FeaturedOrganizers } from "@/components/features";


export default function Home() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("stays");

  // Set active tab based on URL
  useEffect(() => {
    if (pathname === "/" || pathname === "/stays") {
      setActiveTab("stays");
    } else if (pathname === "/events") {
      setActiveTab("events");
    } else if (pathname === "/car-parks") {
      setActiveTab("car-parks");
    }
  }, [pathname]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "stays":
        return <StaysGrid accommodationType="appartments" />;
      case "events":
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-4">
              Events Coming Soon
            </h3>
            <p className="text-gray-500">
              We're working on bringing you the best events in your area.
            </p>
          </div>
        );
      case "car-parks":
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-400 mb-4">
              Car Parks
            </h3>
            <p className="text-gray-400">
              This feature is currently unavailable.
            </p>
          </div>
        );
      default:
        return <StaysGrid accommodationType="appartments" />;
    }
  };

  return (
    <div className="py-8 space-y-12">
      {/* Hero Banner Section */}
      <HeroBanner />

      {/* Tab Navigation with Content */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab}>
        {renderTabContent()}
      </TabNavigation>

 

      {/* Featured Hotels & Landlords Section */}
      <section className="py-12">
        <h2 className="text-2xl font-space-grotesk font-semibold text-gray-900 mb-2">
          Featured Hotels & Landlords
        </h2>
        <p className="text-gray-600 mb-8">Extra description text</p>


        {/* Placeholder for carousel */}
        <FeaturedOrganizers />
      </section>
    </div>
  );
}
