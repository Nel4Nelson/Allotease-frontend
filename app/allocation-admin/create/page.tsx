"use client";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { CreateTabs } from "@/components/features/create/create-tabs";

function CreateContent() {
  return (
    <div className="max-w-[965px] mx-auto lg:mx-[190px] px-6 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4" />

      {/* Page Header */}
      <PageHeader
        title="Set Up New Events, Lodgings, and Parking with Confidence."
        description="Welcome to your resource management hub! Easily create and configure events, accommodations, and car parks with full control over details, capacity, and availability. Get started below to make your spaces accessible for users and maximize their experience."
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
