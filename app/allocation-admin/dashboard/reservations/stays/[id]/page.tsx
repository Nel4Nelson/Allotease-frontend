"use client";
import { Suspense, use } from "react";
import { StayDetailsContent } from "@/components/features/allocation-admin/reservations/stay-details-content";

interface StayDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

function StayDetailsPageContent({ params }: StayDetailsPageProps) {
  const resolvedParams = use(params);
  return <StayDetailsContent stayId={resolvedParams.id} />;
}

export default function StayDetailsPage({ params }: StayDetailsPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StayDetailsPageContent params={params} />
    </Suspense>
  );
}
