"use client";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EventsPreview } from "@/components/features/create/events-preview";

function PreviewContent() {
  return (
    <div className="max-w-[965px] mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4" />
      <EventsPreview />
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div>Loading preview...</div>}>
      <PreviewContent />
    </Suspense>
  );
}
