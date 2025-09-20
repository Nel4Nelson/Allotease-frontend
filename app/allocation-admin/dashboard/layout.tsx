import React from "react";
import { AllocationAdminSidebar } from "@/components/features/allocation-admin/allocation-admin-sidebar";

interface AllocationAdminLayoutProps {
  children: React.ReactNode;
}

export default function AllocationAdminLayout({ children }: AllocationAdminLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Container */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <AllocationAdminSidebar />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Content */}
            <main className="flex-1 p-0">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}