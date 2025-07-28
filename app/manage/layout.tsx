"use client";
import { ManagementLayout } from "@/components/features/management/management-layout";

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <ManagementLayout>{children}</ManagementLayout>
      </div>
    </div>
  );
}