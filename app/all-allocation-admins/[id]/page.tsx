"use client";
import React from "react";
import { AllocationAdminDetailsContent } from "@/components/features/all-allocation-admin/allocation-admin-details-content";

interface AllocationAdminPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AllocationAdminPage({ params }: AllocationAdminPageProps) {
  const { id } = React.use(params);

  return (
    <div className="min-h-screen bg-white">
      <AllocationAdminDetailsContent allocatorId={id} />
    </div>
  );
}