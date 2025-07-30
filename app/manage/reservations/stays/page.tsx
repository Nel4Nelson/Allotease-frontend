import React from "react";
import ReservationboardLayout from "../../reservation/ReservationboardLayout";
import AvailableSpace from "../../reservation/components/layout/AvailableSpace";

export default function StaysPage() {
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
    </ReservationboardLayout>
  );
}
