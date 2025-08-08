"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/navbar";
import { Footer } from "@/components/layout";
import { AuthService } from "@/services/auth-service";
import { Toaster } from 'react-hot-toast';
import { AuthRedirectHandler } from "../features/auth/auth-redirect-handler";
import { SyncLoader } from "react-spinners";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Initialize auth state on app startup
  useEffect(() => {
    setMounted(true);
    AuthService.initializeAuth();
  }, []);

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

  // Use a consistent layout structure to avoid hydration mismatches
  const layoutContent = (
    <>
      {/* GLOBAL: Auth redirect handler for ALL layouts */}
      <AuthRedirectHandler />
      
      {/* GLOBAL: Toast notifications for ALL layouts */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />

      {/* If it's an auth route, render minimal layout */}
      {isAuthRoute ? (
        <div className="min-h-screen">
          {children}
        </div>
      ) : (
        /* Standard layout with header and footer */
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

          {/* Main Content - Conditional width based on route */}
          <main className="relative z-10">
            {isDashboardRoute || isTicketsRoute ? (
              /* Full width for dashboard and tickets */
              <div className="w-full">{children}</div>
            ) : (
              /* Constrained width for regular pages */
              <div className="max-w-[965px] mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="w-full">
            <Footer />
          </footer>
        </div>
      )}
    </>
  );

  // Prevent hydration issues by only rendering after mount
  if (!mounted) {
    return (
      <>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <div className="min-h-screen flex items-center justify-center">
          <SyncLoader
            color="#FF5B06"
            loading={true}
            size={12}
            margin={3}
            speedMultiplier={0.8}
          />
        </div>
      </>
    );
  }

  return layoutContent;
}