"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/navbar";
import { Footer } from "@/components/layout";
import { AuthService } from "@/services/auth-service";
import { useAuthStore } from "@/stores/auth-store";
import { CustomToast } from "@/components/ui/custom-toast";
import { AuthRedirectHandler } from "../features/auth/auth-redirect-handler";
import { SyncLoader } from "react-spinners";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { setMobileDevice, isMobileDevice } = useAuthStore();

  // Enhanced initialization with mobile detection
  useEffect(() => {
    // Detect mobile device
    const detectMobile = () => {
      if (typeof window !== 'undefined') {
        const userAgent = navigator.userAgent;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        return isMobile;
      }
      return false;
    };

    const isMobile = detectMobile();
    setMobileDevice(isMobile);
    
    console.log(`[Layout] Initializing on ${isMobile ? 'mobile' : 'desktop'} device`);
    
    // Initialize auth state
    AuthService.initializeAuth();
    
    // Mark as mounted
    setMounted(true);

    // Mobile-specific initialization delay
    if (isMobile) {
      setTimeout(() => {
        AuthService.synchronizeMobileAuth();
      }, 300);
    }
  }, [setMobileDevice]);

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

  // Enhanced loading screen with mobile consideration
  const loadingScreen = (
    <>
      <CustomToast />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <SyncLoader
            color="#FF5B06"
            loading={true}
            size={isMobileDevice ? 10 : 12}
            margin={3}
            speedMultiplier={0.8}
          />
          <p className="text-gray-600 text-sm">
            {isMobileDevice ? 'Loading your mobile experience...' : 'Loading...'}
          </p>
        </div>
      </div>
    </>
  );

  // Use a consistent layout structure to avoid hydration mismatches
  const layoutContent = (
    <>
      {/* GLOBAL: Auth redirect handler for ALL layouts - but only for specific scenarios */}
      <AuthRedirectHandler />

      {/* GLOBAL: Custom glassmorphism toast notifications for ALL layouts */}
      <CustomToast />

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
    return loadingScreen;
  }

  return layoutContent;
}