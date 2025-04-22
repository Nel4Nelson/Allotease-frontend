import React from "react";

const EventDetails = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="">
        <h3 className="text-[#1F2024] font-bold text-xl">Event Details</h3>

        <div className="flex items-start gap-1 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-timer-icon lucide-timer mt-1"
          >
            <line x1="10" x2="14" y1="2" y2="2" />
            <line x1="12" x2="15" y1="14" y2="11" />
            <circle cx="12" cy="14" r="8" />
          </svg>

          <div className=" font-source">
            <div className="text-[#1F2024] text-sm font-semibold flex items-center gap-3 pb-3">
              <h4 className="bg-[#F2F4F7] rounded">9:30 </h4>
              <h4 className="bg-[#F2F4F7] rounded">10:00</h4>
              <h4 className="text-base">Registration and breakfast</h4>
            </div>

            <div className="text-sm md:text-base text-[#71727A] ">
              <p>
                Arrive to get settled into Pakhuis de Zwijger and meet others
                before we kick off the day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
