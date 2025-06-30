"use client";
import React from "react";

export function CreateHeader() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="py-4 border-b border-gray-200">
        <nav className="text-sm text-gray-500 font-source-sans-pro">
          Admin / create_event
        </nav>
      </div>

      {/* Header Section */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold font-space-grotesk text-[var(--title-color)] mb-4">
          Set Up New Events, Lodgings, and Parking with Confidence.
        </h1>
        <p className="text-[var(--body-text)] font-source-sans-pro max-w-2xl mx-auto">
          Welcome to your resource management hub! Easily create and configure
          events, accommodations, and car parks with full control over details,
          capacity, and availability. Get started below to make your spaces
          accessible for users and maximize their experience.
        </p>
      </div>
    </div>
  );
}
