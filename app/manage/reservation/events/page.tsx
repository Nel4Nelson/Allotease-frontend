"use client";

import EventPageHero from "@/components/features/management/reservations/events/EventPageHero";
import React from "react";
import ReservationboardLayout from "../../../../components/features/management/reservations/reservation-boardLayout";

export default function EventPage() {
  return (
    <ReservationboardLayout
      imageSrc="/images/web-cam.png"
      headerTitle="Timely and Adaptive Strategies to Optimize Suicide Prevention among Youth"
      buttonText="Edit stay details"
      buttonHref="/manage/reservation/stays/edit"
    >
      <EventPageHero />
    </ReservationboardLayout>
  );
}
