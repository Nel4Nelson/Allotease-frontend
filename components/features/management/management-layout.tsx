"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Browsers, Wine, Armchair } from "phosphor-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  title: string;
  Icon: React.ElementType;
  href: string;
}

interface ManagementLayoutProps {
  children: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  { title: "Overview", Icon: Browsers, href: "/manage/overview" },
  { title: "Reservations", Icon: Wine, href: "/manage/reservation" },
  { title: "Withdrawal", Icon: Armchair, href: "/manage/withdrawal" },
];

export function ManagementLayout({ children }: ManagementLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-space-grotesk">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-2 text-gray-600"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          Management
        </button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside
          className={cn(
            "w-[220px] bg-white border-r border-gray-200 p-4 transition-transform duration-200 ease-in-out",
            "md:block", // Always visible on desktop
            isMobileMenuOpen
              ? "block absolute inset-y-0 left-0 z-50 md:relative"
              : "hidden" // Mobile toggle
          )}
        >
          {/* Mobile close button */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 font-space-grotesk">
              Management
            </h3>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Desktop title */}
          <h3 className="hidden md:block text-lg font-semibold text-gray-900 mb-6 font-space-grotesk">
            Management
          </h3>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-md transition-all duration-200",
                    isActive
                      ? "bg-[#E6F7F0] text-[#0A9355] font-medium"
                      : "text-[#71727A] hover:bg-[#F2F4F7CC] hover:text-gray-900"
                  )}
                >
                  <item.Icon size={20} />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
