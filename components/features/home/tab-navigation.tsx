"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export function TabNavigation({ activeTab, onTabChange, children }: TabNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (value: string) => {
    onTabChange(value);
    
    // Update URL based on tab
    if (value === 'stays') {
      router.push('/');
    } else if (value === 'events') {
      router.push('/events');
    } else if (value === 'car-parks') {
      router.push('/car-parks');
    }
  };

  return (
    <section className="py-8">
      <div className="flex justify-center mb-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-fit">
          <TabsList>
            <TabsTrigger value="stays">Stays</TabsTrigger>
            <TabsTrigger value="events">Event</TabsTrigger>
            <TabsTrigger value="car-parks" disabled className="opacity-50 cursor-not-allowed">
              Car parks
            </TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-8">
            {children}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
