"use client";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { CreateTabs } from "@/components/features/create/create-tabs";

function CreateContent() {
  return (
    <div className="max-w-[1050px] mx-auto lg:mx-[180px] px-6 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4" />

      {/* Page Header */}
      <PageHeader
        title="Set Up Your Spaces and Host Events with Ease."
        description="Welcome to your resource management hub! List and monetize your spaces, manage events stress-free, and grow your income — all in one place. Because yes, you love making money, and so do we. Let’s make it happen together!"
        className="mb-8"
      />

      {/* Create Tabs */}
      <CreateTabs />
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateContent />
    </Suspense>
  );
}
