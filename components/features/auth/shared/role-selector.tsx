"use client";
import React from "react";
import { UserType } from "@/types/auth";

interface RoleSelectorProps {
  onSelect: (type: UserType) => void;
  title?: string;
  subtitle?: string;
}

export function RoleSelector({
  onSelect,
  title = "How would you like to continue?",
  subtitle = "Choose your account type to get started",
}: RoleSelectorProps) {
  const roles = [
    {
      type: "attendee" as UserType,
      title: "Sign in as Attendee",
      description: "Book accommodations and join events",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      type: "admin" as UserType,
      title: "Sign in as Organization Admin",
      description: "Manage your organization and events",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold font-space-grotesk text-[var(--title-color)]">
          {title}
        </h2>
        <p className="text-[var(--body-text)] font-source-sans-pro">
          {subtitle}
        </p>
      </div>

      {/* Role Cards */}
      <div className="space-y-3">
        {roles.map((role) => (
          <button
            key={role.type}
            onClick={() => onSelect(role.type)}
            className="
              w-full p-4 rounded-xl border-2 border-[var(--input-border)]
              bg-[var(--input-background)] 
              hover:border-[var(--feature-accent-orange)] 
              hover:bg-[var(--input-background)]/80
              focus:outline-none focus:ring-2 focus:ring-[var(--feature-accent-orange)]/20 focus:border-[var(--feature-accent-orange)]
              transition-all duration-200 ease-out
              group
            "
          >
            <div className="flex items-center space-x-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center text-[var(--feature-accent-orange)] group-hover:scale-110 transition-transform duration-200">
                {role.icon}
              </div>

              {/* Content */}
              <div className="flex-1 text-left">
                <h3 className="font-semibold font-source-sans-pro text-[var(--title-color)] group-hover:text-[var(--feature-accent-orange)] transition-colors duration-200">
                  {role.title}
                </h3>
                <p className="text-sm text-[var(--body-text)] font-source-sans-pro mt-1">
                  {role.description}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 text-[var(--body-text)] group-hover:text-[var(--feature-accent-orange)] group-hover:translate-x-1 transition-all duration-200">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
