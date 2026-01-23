"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, ReactNode, Suspense } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export interface TabConfig {
  value: string;
  label: string;
  content: ReactNode;
}

interface TabsWithUrlStateProps {
  tabs: TabConfig[];
  defaultTab: string;
  basePath: string; // e.g., "/super-admin/create" or "/"
  queryParam?: string; // defaults to "type"
  className?: string;
  renderHeader?: (tabsList: ReactNode) => ReactNode; // Optional custom header renderer
}

export function CustomTabsContent({
  tabs,
  defaultTab,
  basePath,
  queryParam = "type",
  className = "",
  renderHeader,
}: TabsWithUrlStateProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before accessing search params
  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTab = mounted
    ? (searchParams.get(queryParam) as string) || defaultTab
    : defaultTab;

  const handleTabChange = (value: string) => {
    // Create new URLSearchParams to preserve existing parameters
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    // Update only the specific parameter
    newSearchParams.set(queryParam, value);
    
    // Build the new URL with all parameters
    const newUrl = `${basePath}?${newSearchParams.toString()}`;
    
    router.push(newUrl);
  };

  // Render the tabs list
  const tabsList = (
    <TabsList>
      {tabs.map((tab) => (
        <TabsTrigger key={tab.value} value={tab.value}>
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );

  // Render immediately with default tab to prevent layout shift
  // The actual tab content will handle its own loading states
  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        {/* Render custom header if provided, otherwise render tabs list directly */}
        {renderHeader ? renderHeader(tabsList) : tabsList}

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-8">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export function TabsWithUrlState(props: TabsWithUrlStateProps) {
  return (
    <Suspense fallback={null}>
      <CustomTabsContent {...props} />
    </Suspense>
  );
}