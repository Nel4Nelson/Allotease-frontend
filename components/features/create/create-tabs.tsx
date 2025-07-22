"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StaysForm, type StaysFormData } from "./stays-form";
import { EventsForm, type EventsFormData } from "./events-form";

type TabType = "stays" | "events" | "car-parks";

interface CreateTabsProps {
  className?: string;
}

export function CreateTabs({ className = "" }: CreateTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before accessing search params
  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTab = mounted
    ? (searchParams.get("type") as TabType) || "events"
    : "events";

  const handleTabChange = (value: string) => {
    router.push(`/allocation-admin/create?type=${value}`);
  };

  const handleStaysSubmit = (data: StaysFormData) => {
    console.log("Stays data:", data);
    // Handle stays form submission
  };

  const handleEventsSubmit = (data: EventsFormData) => {
    console.log("Events data:", data);
    // Handle events form submission
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
          <TabsTrigger value="stays">Stays</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="car-parks">Car parks</TabsTrigger>
        </TabsList>

        <TabsContent value="stays" className="mt-8">
          <StaysForm onSubmit={handleStaysSubmit} />
        </TabsContent>

        <TabsContent value="events" className="mt-8">
          <EventsForm onSubmit={handleEventsSubmit} />
        </TabsContent>

        <TabsContent value="car-parks" className="mt-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Create New Car Park</h2>
            <p className="text-gray-600">
              Car park form content will go here...
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
