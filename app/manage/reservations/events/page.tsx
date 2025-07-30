import EventPageHero from "@/app/manage/reservation/components/layout/EventPageHero";
import React from "react";
import ReservationboardLayout from "../../reservation/ReservationboardLayout";

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
