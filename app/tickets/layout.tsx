"use client";
import { TicketsProfileSidebar } from "@/components/features/tickets/tickets-profile-sidebar";

interface TicketsLayoutProps {
  children: React.ReactNode;
}

export default function TicketsLayout({ children }: TicketsLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1050px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Profile Sidebar - 30% width on desktop */}
          <div className="w-[30%] hidden lg:block">
            <div className="sticky top-8">
              <TicketsProfileSidebar />
            </div>
          </div>

          {/* Mobile profile section - you can add mobile menu logic here */}
          <div className="lg:hidden w-full">
            {/* Mobile profile menu button and overlay would go here */}
            <div className="mb-6">
              <TicketsProfileSidebar />
            </div>
          </div>

          {/* Main Content Area - 70% width on desktop, full width on mobile */}
          <div className="flex-1 lg:w-[70%]">{children}</div>
        </div>
      </div>
    </div>
  );
}
