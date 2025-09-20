"use client";
import { Suspense } from "react";
import { ReservationsContent } from "@/components/features/allocation-admin/reservations/reservations-content";

function ReservationsPageContent() {
  return <ReservationsContent />;
}

export default function AllocationAdminReservationsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReservationsPageContent />
    </Suspense>
  );
}
