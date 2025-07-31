"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/navbar";
import { Footer } from "@/components/layout";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Check if we're in an auth route
  const isAuthRoute =
    pathname.startsWith("/signin") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/upgrade") ||
    pathname.startsWith("/email-verification") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/about");

  // Check if we're in a dashboard route that needs full width
  const isDashboardRoute =
    pathname.startsWith("/allocation-admin/dashboard") ||
    pathname === "/allocation-admin/dashboard/overview" ||
    pathname === "/allocation-admin/dashboard/reservations" ||
    pathname === "/allocation-admin/dashboard/withdrawal";

  // Check if we're in a tickets route that needs full width
  const isTicketsRoute = pathname.startsWith("/tickets");

  // If it's an auth route, render minimal layout
  if (isAuthRoute) {
    return <div className="min-h-screen">{children}</div>;
  }

  // If it's a dashboard or tickets route, render full-width layout
  if (isDashboardRoute || isTicketsRoute) {
    return (
      <div className="min-h-screen relative">
        {/* Header */}
        <header className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 relative">
          {/* Background Gradient - positioned in header area */}
          <div className="absolute inset-0 -z-10">
            <div
              className="absolute inset-0 blur-2xl"
              style={{
                background:
                  "linear-gradient(354deg, #FFF 24.04%, rgba(255, 243, 230, 0.35) 59.41%, #D5FFEB 113.97%)",
                filter: "blur(24px)",
                opacity: 0.6,
              }}
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Header />
          </div>
        </header>

        {/* Main Content - Full width for dashboard and tickets */}
        <main className="relative z-10 w-full">{children}</main>

        {/* Footer */}
        <footer className="w-full">
          <Footer />
        </footer>
      </div>
    );
  }

  // Otherwise, render the standard constrained layout
  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 relative">
        {/* Background Gradient - positioned in header area */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0 blur-2xl"
            style={{
              background:
                "linear-gradient(354deg, #FFF 24.04%, rgba(255, 243, 230, 0.35) 59.41%, #D5FFEB 113.97%)",
              filter: "blur(24px)",
              opacity: 0.6,
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Header />
        </div>
      </header>

      {/* Main Content - Constrained width for regular pages */}
      <main className="relative z-10">
        <div className="max-w-[965px] mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
}
