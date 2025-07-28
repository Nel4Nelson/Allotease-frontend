"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EventsPreview } from "@/components/features/create/events-preview";
import { StaysPreview } from "@/components/features/create/stays-preview";

function PreviewContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const renderPreview = () => {
    switch (type) {
      case "stays":
        return <StaysPreview />;
      case "events":
      default:
        return <EventsPreview />;
    }
  };

  return (
    <div className="max-w-[965px] mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4" />
      {renderPreview()}
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
