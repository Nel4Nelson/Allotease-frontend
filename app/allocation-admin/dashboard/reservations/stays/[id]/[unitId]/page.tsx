"use client";
import { Suspense, use } from "react";
import { UnitReservationsContent } from "@/components/features/allocation-admin/reservations/unit-reservations-content";

interface UnitReservationsPageProps {
  params: Promise<{
    id: string;
    unitId: string;
  }>;
}

function UnitReservationsPageContent({ params }: UnitReservationsPageProps) {
  const resolvedParams = use(params);
  return (
    <UnitReservationsContent
      stayId={resolvedParams.id}
      unitId={resolvedParams.unitId}
    />
  );
}

export default function UnitReservationsPage({
  params,
}: UnitReservationsPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnitReservationsPageContent params={params} />
    </Suspense>
  );
}
