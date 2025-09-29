"use client";
import { Suspense, use } from "react";
import { EventDetailsContent } from "@/components/features/allocation-admin/reservations/event-details-content";

interface EventDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

function EventDetailsPageContent({ params }: EventDetailsPageProps) {
  const resolvedParams = use(params);
  return <EventDetailsContent eventId={resolvedParams.id} />;
}

export default function EventDetailsPage({ params }: EventDetailsPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EventDetailsPageContent params={params} />
    </Suspense>
  );
}