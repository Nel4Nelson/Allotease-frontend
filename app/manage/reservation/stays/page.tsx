import React from "react";
import ReservationboardLayout from "../../../../components/features/management/reservations/reservation-boardLayout";
import AvailableSpace from "../../../../components/features/management/reservations/stays/available-space";
import { TransformedReservation } from "@/utils/stay-reservation-transformer";
import { StaysReservations } from "@/components/features";

export default function StaysPage() {
  const dummyReservations: TransformedReservation[] = [
    {
      id: "RSV-001",
      guestName: "Jane Doe",
      roomType: "Deluxe Suite",
      dates: "2025-08-01 to 2025-08-05",
      status: "Confirmed",
    },
    {
      id: "RSV-002",
      guestName: "John Smith",
      roomType: "Standard Room",
      dates: "2025-08-10 to 2025-08-12",
      status: "Pending",
    },
    {
      id: "RSV-003",
      guestName: "Alice Johnson",
      roomType: "Executive Room",
      dates: "2025-08-15 to 2025-08-20",
      status: "Cancelled",
    },
  ];

  return (
    <ReservationboardLayout
      imageSrc="/images/web-cam.png"
      headerTitle="Witness Garden"
      buttonText="Edit stay details"
      buttonHref="/manage/reservation/stays/edit"
    >
      <div className="border border-[#8AAEA433] bg-[#F2F4F780] rounded-lg p-4">
        <AvailableSpace />
      </div>

      {/* Reservation Table */}
      <div className="mt-8">
        <StaysReservations reservations={dummyReservations} />

      </div>
    </ReservationboardLayout>
  );
}
