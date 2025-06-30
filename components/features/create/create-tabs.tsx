// /components/features/create/create-tabs.tsx
"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SingleFormEventCreation } from "./events/single-form-event-creation";
import { ComingSoon } from ".";

export function CreateTabs() {
  const [currentTab, setCurrentTab] = useState("events");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-80 grid-cols-3 bg-[var(--card-background)] border border-[var(--input-border)]">
            <TabsTrigger
              value="stays"
              className="font-source-sans-pro font-medium data-[state=active]:bg-[var(--feature-accent-orange)] data-[state=active]:text-white"
            >
              Stays
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="font-source-sans-pro font-medium data-[state=active]:bg-[var(--feature-accent-orange)] data-[state=active]:text-white"
            >
              Events
            </TabsTrigger>
            <TabsTrigger
              value="car-parks"
              className="font-source-sans-pro font-medium data-[state=active]:bg-[var(--feature-accent-orange)] data-[state=active]:text-white"
            >
              Car parks
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <TabsContent value="stays" className="mt-0">
          <ComingSoon type="stays" />
        </TabsContent>

        <TabsContent value="events" className="mt-0">
          <SingleFormEventCreation />
        </TabsContent>

        <TabsContent value="car-parks" className="mt-0">
          <ComingSoon type="car-parks" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
