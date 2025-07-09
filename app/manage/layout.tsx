"use client";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ManagementLayout } from "@/components/features/management/management-layout";

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <ManagementLayout>{children}</ManagementLayout>
      </div>
      <Footer />
    </div>
  );
}
