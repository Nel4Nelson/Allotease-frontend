"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BrowsersIcon, BrandyIcon, ArmchairIcon } from "@/components/icons";
import { useSidebarStore } from "@/stores/sidebar-store";

export function AllocationAdminSidebar() {
  const pathname = usePathname();
  const { isOpen, closeSidebar } = useSidebarStore();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
    <>
      {/* Backdrop Overlay - Only visible on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ease-in-out"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static
          top-0 left-0 bottom-0
          w-64 min-h-screen
          bg-white p-6
          border-r border-gray-200
          z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Close Button - Only visible on mobile */}
        <button
          onClick={closeSidebar}
          className="md:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close sidebar"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

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
      </aside>
    </>
  );
}