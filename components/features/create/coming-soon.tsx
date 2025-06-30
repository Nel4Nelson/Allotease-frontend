"use client";
import React from "react";

interface ComingSoonProps {
  type: "stays" | "car-parks";
}

export function ComingSoon({ type }: ComingSoonProps) {
  const content = {
    stays: {
      title: "Stays Creation Coming Soon",
      description:
        "We're working on bringing you the ability to create and manage accommodation listings. Stay tuned!",
      icon: (
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    "car-parks": {
      title: "Car Parks Creation Coming Soon",
      description:
        "We're working on bringing you the ability to create and manage parking space listings. Stay tuned!",
      icon: (
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-2"
          />
        </svg>
      ),
    },
  };

  const { title, description, icon } = content[type];

  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h2 className="text-2xl font-bold font-space-grotesk text-[var(--title-color)] mb-3">
        {title}
      </h2>
      <p className="text-[var(--body-text)] font-source-sans-pro max-w-md mx-auto">
        {description}
      </p>
    </div>
  );
}
