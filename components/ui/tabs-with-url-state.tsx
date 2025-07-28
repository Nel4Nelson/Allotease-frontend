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
  basePath: string; // e.g., "/allocation-admin/create" or "/"
  queryParam?: string; // defaults to "type"
  className?: string;
}

export function CustomTabsContent({
  tabs,
  defaultTab,
  basePath,
  queryParam = "type",
  className = "",
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
    router.push(`${basePath}?${queryParam}=${value}`);
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={className}>
        <div className="h-12 bg-gray-100 rounded-lg animate-pulse mb-8"></div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-100 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
          <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

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
    <Suspense fallback={<div>Loading tabs...</div>}>
      <CustomTabsContent {...props} />
    </Suspense>
  );
}