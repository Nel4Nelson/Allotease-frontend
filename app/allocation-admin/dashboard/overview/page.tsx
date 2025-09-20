"use client";
import { Suspense } from "react";
import { OverviewContent } from "@/components/features/allocation-admin/overview/overview-content";

function OverviewPageContent() {
  return <OverviewContent />;
}

export default function AllocationAdminOverviewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OverviewPageContent />
    </Suspense>
  );
}