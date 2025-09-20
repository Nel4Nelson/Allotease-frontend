"use client";
import React from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ReservationsTabs } from "./reservations-tabs";

export function ReservationsContent() {
  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb className="" />

      {/* Reservations Tabs */}
      <ReservationsTabs />
    </div>
  );
}
