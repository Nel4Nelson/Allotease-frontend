"use client";
import { Suspense } from "react";
import { WithdrawalContent } from "@/components/features/allocation-admin/withdrawal/withdrawal-content";

function WithdrawalPageContent() {
  return <WithdrawalContent />;
}

export default function AllocationAdminWithdrawalPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WithdrawalPageContent />
    </Suspense>
  );
}
