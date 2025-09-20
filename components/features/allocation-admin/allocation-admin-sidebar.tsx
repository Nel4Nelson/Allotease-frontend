"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BrowsersIcon, BrandyIcon, ArmchairIcon } from "@/components/icons";

export function AllocationAdminSidebar() {
  const pathname = usePathname();

  const navigationItems = [
    {
      label: "Overview",
      href: "/allocation-admin/dashboard",
      icon: BrowsersIcon,
      isActive:
        pathname === "/allocation-admin/dashboard" ||
        pathname === "/allocation-admin/dashboard/overview",
    },
    {
      label: "Reservations",
      href: "/allocation-admin/dashboard/reservations",
      icon: BrandyIcon,
      isActive: pathname.includes("/reservations"),
    },
    {
      label: "Withdrawal",
      href: "/allocation-admin/dashboard/withdrawal",
      icon: ArmchairIcon,
      isActive: pathname.includes("/withdrawal"),
    },
  ];

  return (
    <div className="w-64 min-h-screen bg-white p-6 border-r border-gray-200">
      {/* Management Title */}
      <div className="mb-6">
        <h2 className="text-[20px] font-bold leading-[140%] tracking-[-0.4px] text-[#1F2024] font-space-grotesk">
          Management
        </h2>
      </div>

      {/* Navigation Items */}
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center w-full px-5 py-4 rounded-lg transition-colors font-source-sans gap-2 text-[#71727A]
                ${
                  item.isActive
                    ? "bg-[rgba(242,244,247,0.80)] text-[#1F2024]"
                    : "hover:bg-gray-50 hover:text-[#1F2024]"
                }
              `}
            >
              <IconComponent size={16} />
              <span className="font-source-sans text-[16px] font-semibold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
