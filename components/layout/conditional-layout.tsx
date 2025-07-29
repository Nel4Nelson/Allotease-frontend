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

  // If it's an auth route, render minimal layout
  if (isAuthRoute) {
    return <div className="min-h-screen">{children}</div>;
  }

  // Otherwise, render the full layout with header and footer
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

      {/* Main Content */}
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
