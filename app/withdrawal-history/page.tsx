"use client";
import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WithdrawalLayout } from "@/components/features/withdrawal/withdrawal-layout";

export default function WithdrawalHistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <WithdrawalLayout />
      </main>
      <Footer />
    </div>
  );
}
