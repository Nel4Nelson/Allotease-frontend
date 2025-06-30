"use client";
import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TicketsLayout } from "@/components/features/tickets/tickets-layout";

export default function TicketsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <TicketsLayout />
      <Footer />
    </div>
  );
}
