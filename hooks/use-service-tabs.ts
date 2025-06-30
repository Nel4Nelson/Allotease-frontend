"use client";
import { ServiceType } from "@/types";
import { useState, useCallback } from "react";

export function useServiceTabs(defaultTab: ServiceType = "stays") {
  const [activeTab, setActiveTab] = useState<ServiceType>(defaultTab);

  const changeTab = useCallback((tab: ServiceType) => {
    setActiveTab(tab);
  }, []);

  return {
    activeTab,
    changeTab,
  };
}
