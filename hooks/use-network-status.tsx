"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface NetworkContextType {
  isOnline: boolean;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

// Network status provider component - handles toasts centrally
export function NetworkStatusProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(() => {
    // Safe initialization for SSR
    if (typeof window !== "undefined") {
      return navigator.onLine;
    }
    return true;
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      setIsOnline(true);
      toast.success("You are back online!", {
        duration: 3000,
        style: {
          background: "#10B981",
          color: "#fff",
        },
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("Please check your internet connection.", {
        duration: 4000,
        style: {
          background: "#EF4444",
          color: "#fff",
        },
      });
    };

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <NetworkContext.Provider value={{ isOnline }}>
      {children}
    </NetworkContext.Provider>
  );
}

// Hook to use network status
export function useNetworkStatus() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useNetworkStatus must be used within a NetworkStatusProvider");
  }
  return context;
}

// Simplified hook for components that just need online/offline status
export function useIsOnline() {
  const { isOnline } = useNetworkStatus();
  return isOnline;
}