//archieve: This code is not used anywhere
"use client";
import React from "react";
import { UserType } from "@/types/auth";
import {
  ArrowUpRightIcon,
  OrganizationIcon,
  PersonIcon,
} from "@/components/icons";

interface AccountOption {
  label: string;
  type: UserType;
  icon: React.ReactNode;
}

interface RoleSelectorProps {
  onSelect: (type: UserType) => void;
  title?: string;
  subtitle?: string;
  context?: "signup" | "signin";
}

export function RoleSelector({
  onSelect,
  title = "How would you like to continue?",
  subtitle = "Choose your account type to get started",
  context = "signin", // Default to signin for backward compatibility
}: RoleSelectorProps) {
  // Dynamic options based on context
  const getAccountOptions = (): AccountOption[] => {
    if (context === "signup") {
      return [
        {
          label: "Sign up as User",
          type: "attendee",
          icon: <PersonIcon />,
        },
        {
          label: "Sign up as Allocation Admin",
          type: "admin",
          icon: <OrganizationIcon />,
        },
      ];
    } else {
      // signin context
      return [
        {
          label: "Sign in as User",
          type: "attendee",
          icon: <PersonIcon />,
        },
        {
          label: "Sign in as Allocation Admin",
          type: "admin",
          icon: <OrganizationIcon />,
        },
      ];
    }
  };

  const accountOptions = getAccountOptions();

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

      {/* Role Cards - Using your brand styling */}
      <div className="flex flex-col items-center space-y-4 mt-4">
        {accountOptions.map((option) => (
          <button
            key={option.type}
            onClick={() => onSelect(option.type)}
            className="
              group
              w-[296px] sm:w-[320px] md:w-[296px] lg:w-[296px]
              h-[78px] sm:h-[84px] md:h-[78px] lg:h-[78px]
              px-3 sm:px-4 md:px-3 lg:px-3
              flex 
              items-center 
              justify-between
              bg-[rgba(242,244,247,0.60)]
              backdrop-blur-[21px]
              cursor-pointer
              rounded-2xl
              hover:bg-[rgba(242,244,247,0.75)]
              active:bg-[rgba(242,244,247,0.85)]
              transition-all 
              duration-200 
              focus:outline-none 
              focus:ring-2 
              focus:ring-[#FF5B00]/30 
              focus:ring-offset-2
              hover:scale-[1.02]
              active:scale-[0.98]
            "
            aria-label={option.label}
          >
            <div className="flex items-center gap-2">
              <span className="flex-shrink-0">{option.icon}</span>
              <span
                className="
                  font-source-sans-pro 
                  font-semibold 
                  leading-normal 
                  text-[#FF5B00]
                  text-base sm:text-lg md:text-base lg:text-base
                "
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
                {option.label}
              </span>
            </div>
            <ArrowUpRightIcon />
          </button>
        ))}
      </div>
    </div>
  );
}
