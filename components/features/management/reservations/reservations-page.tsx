"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaysListings } from "./stays-listings";
import { EventsListings } from "./events-listings";
import { ParkingListings } from "./parking-listings";
import { Listing } from "./listing-card";

// Mock data - replace with real API data
const mockStays: Listing[] = [
  {
    id: "stay-1",
    title: "Timely and Adaptive Strategies to Optimize Suicide Prevention...",
    image: "/images/web-cam.png",
    date: {
      day: "Thursday",
      time: "6:00 PM GMT+1",
    },
    type: "stay",
    manageUrl: "/manage/stays/stay-1",
  },
  {
    id: "stay-2",
    title: "Luxury Downtown Apartment",
    image: "/images/web-cam.png",
    date: {
      day: "Friday",
      time: "8:00 AM GMT+1",
    },
    type: "stay",
    manageUrl: "/manage/stays/stay-2",
  },
  {
    id: "stay-3",
    title: "Cozy Beach House Retreat",
    image: "/images/web-cam.png",
    date: {
      day: "Saturday",
      time: "10:00 AM GMT+1",
    },
    type: "stay",
    manageUrl: "/manage/stays/stay-3",
  },
];

const mockEvents: Listing[] = [
  {
    id: "event-1",
    title: "Timely and Adaptive Strategies to Optimize Suicide Prevention...",
    image: "/images/web-cam.png",
    date: {
      day: "Thursday",
      time: "6:00 PM GMT+1",
    },
    status: "Free",
    location: "Flend Worldwide",
    followersCount: "117.5K Followers",
    type: "event",
  },
  {
    id: "event-2",
    title: "Mental Health Awareness Workshop",
    image: "/images/web-cam.png",
    date: {
      day: "Friday",
      time: "2:00 PM GMT+1",
    },
    status: "Free",
    location: "Flend Worldwide",
    followersCount: "117.5K Followers",
    type: "event",
  },
  {
    id: "event-3",
    title: "Community Wellness Summit",
    image: "/images/web-cam.png",
    date: {
      day: "Sunday",
      time: "9:00 AM GMT+1",
    },
    status: "Free",
    location: "Flend Worldwide",
    followersCount: "117.5K Followers",
    type: "event",
  },
];

interface ReservationsPageProps {
  loading?: boolean;
}

export function ReservationsPage({ loading = false }: ReservationsPageProps) {
  const [activeTab, setActiveTab] = useState("stays");
  const router = useRouter();

  const handleCreateNewStay = () => {
    // TODO: Navigate to create stay flow
    console.log("Creating new stay...");
    // router.push("/create/stay");
  };

  const handleCreateNewEvent = () => {
    // TODO: Navigate to create event flow
    console.log("Creating new event...");
    router.push("/create");
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-[#71727A] font-source">
        Admin / reservation
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-[280px] h-[40px] border border-[#8AAEA433] bg-transparent rounded-lg">
          <TabsTrigger
            value="stays"
            className="data-[state=active]:bg-transparent data-[state=active]:text-[#1F2024] text-[#71727A] font-semibold"
          >
            Stays
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="data-[state=active]:bg-transparent data-[state=active]:text-[#1F2024] text-[#71727A] font-semibold"
          >
            Events
          </TabsTrigger>
          <TabsTrigger
            value="parking"
            className="data-[state=active]:bg-transparent data-[state=active]:text-[#1F2024] text-[#71727A] font-semibold"
          >
            Car parks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stays" className="mt-8">
          <StaysListings
            stays={mockStays}
            loading={loading}
            onCreateNew={handleCreateNewStay}
          />
        </TabsContent>

        <TabsContent value="events" className="mt-8">
          <EventsListings
            events={mockEvents}
            loading={loading}
            onCreateNew={handleCreateNewEvent}
          />
        </TabsContent>

        <TabsContent value="parking" className="mt-8">
          <ParkingListings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
