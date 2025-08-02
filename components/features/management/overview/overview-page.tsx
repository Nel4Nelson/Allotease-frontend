"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BalanceCard } from "./balance-card";
import { StatsSection } from "./stats-section";
import { StaysReservations } from "./stays-reservations";
import { EventsReservations } from "./events-reservations";
import {
  useEventStats,
  useRecentEventsReservations,
  useRecentStaysReservations,
  useStayStats,
} from "@/hooks/use-overview";
import { transformToStatCards } from "@/utils/stats-transformer";
import { transformStayReservationData } from "@/utils/stay-reservation-transformer";
import { transformEventReservationData } from "@/utils/events-reservation-tranformer";

interface OverviewPageProps {
  onWithdraw?: () => void;
  balance?: number;
  formattedBalance?: string;
  isLoading?: boolean;
  error?: string | null;
}

export function OverviewPage({
  onWithdraw,
  balance = 0,
  isLoading = false,
  error = null,
}: OverviewPageProps) {
  const [activeTab, setActiveTab] = useState("stays");

  // Fetch data using hooks
  const {
    data: stayStats,
    loading: stayStatsLoading,
    error: stayStatsError,
  } = useStayStats();

  const {
    data: eventStats,
    loading: eventStatsLoading,
    error: eventStatsError,
  } = useEventStats();

  const {
    data: stayReservations,
    loading: stayReservationsLoading,
    error: stayReservationsError,
  } = useRecentStaysReservations();

  const {
    data: eventReservations,
    loading: eventReservationsLoading,
    error: eventReservationsError,
  } = useRecentEventsReservations();

  const handleSearch = (value: string) => {
    console.log("Searching:", value);
    // TODO: Implement search functionality
  };

  const handleSort = (value: string) => {
    console.log("Sorting by:", value);
    // TODO: Implement sort functionality
  };

  const handleExport = () => {
    console.log("Exporting data...");
    // TODO: Implement export functionality
  };

  const getCurrentStats = () => {
    if (activeTab === "stays" && stayStats)
      return transformToStatCards(stayStats);
    if (activeTab === "events" && eventStats)
      return transformToStatCards(eventStats);
    return [];
  };

  // Transform the data before passing to component
  const transformedStayReservations = stayReservations?.reservations
    ? transformStayReservationData(stayReservations.reservations)
    : [];

  // Transform the data before passing to component
  const transformedEventReservations = eventReservations?.events
    ? transformEventReservationData(eventReservations.events)
    : [];

  return (
    <div className="space-y-6">
      {/* Balance Card with Withdrawal - now uses dynamic balance */}
      <BalanceCard
        balance={balance}
        onWithdraw={onWithdraw}
        isLoading={isLoading}
        error={error}
      />

      {/* Error Handling for Stats */}
      {activeTab === "stays" && stayStatsError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mt-8">
          <p className="text-red-600 text-sm">
            {stayStatsError.message || "Failed to load stay statistics."}
          </p>
        </div>
      )}

      {activeTab === "events" && eventStatsError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mt-8">
          <p className="text-red-600 text-sm">
            {eventStatsError.message || "Failed to load event statistics."}
          </p>
        </div>
      )}

      {/* Reservations Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="pt-10 ">
        <TabsList className="grid w-full grid-cols-3 max-w-[265px] text-[18px]">
          <TabsTrigger value="stays">Stays</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="parking">Car Parks</TabsTrigger>
        </TabsList>

        {/* Stats Section */}
        <StatsSection
          stats={getCurrentStats()}
          loading={
            (activeTab === "stays" && (stayStatsLoading || !stayStats)) ||
            (activeTab === "events" && (eventStatsLoading || !eventStats))
          }
        />

        <TabsContent value="stays" className="">
          {stayReservationsError ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">
                Failed to load stay reservations.
              </p>
            </div>
          ) : (
            <StaysReservations
              reservations={transformedStayReservations}
              onSearch={handleSearch}
              onSort={handleSort}
              onExport={handleExport}
              loading={stayReservationsLoading}
            />
          )}
        </TabsContent>

        <TabsContent value="events">
          {eventReservationsError ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">
                Failed to load event reservations.
              </p>
            </div>
          ) : (
            <EventsReservations
              reservations={transformedEventReservations}
              onSearch={handleSearch}
              onSort={handleSort}
              onExport={handleExport}
              loading={eventReservationsLoading}
            />
          )}
        </TabsContent>

        <TabsContent value="parking" className="mt-6">
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-lg font-semibold mb-2">
              Car Parks Coming Soon!
            </h3>
            <p className="text-sm">
              We are working on adding parking reservations.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
