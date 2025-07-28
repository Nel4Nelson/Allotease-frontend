import React from "react";
import { useEventFormStore } from "@/stores/event-form-store";

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M10 16.875C13.797 16.875 16.875 13.797 16.875 10C16.875 6.20304 13.797 3.125 10 3.125C6.20304 3.125 3.125 6.20304 3.125 10C3.125 13.797 6.20304 16.875 10 16.875Z"
      stroke="#1F3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 10L13.0937 6.90625"
      stroke="#1F3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.125 0.625H11.875"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface EventDetailsProps {
  className?: string;
}

export function EventDetails({ className = "" }: EventDetailsProps) {
  const { formData } = useEventFormStore();

  // Format time to match target design (just HH:MM without am/pm)
  const formatTime = (time: string): string => {
    if (!time) return "";
    return time; // Keep it as is (e.g., "9:30", "10:00")
  };

  // Get agenda items or show placeholder
  const agendaItems =
    formData.agenda && formData.agenda.length > 0
      ? formData.agenda
      : [
          {
            id: "1",
            title: "Registration and breakfast",
            description:
              "Arrive to get settled into Pakhuis de Zwijger and meet others before we kick off the day.",
            startTime: "9:30",
            endTime: "10:00",
          },
          {
            id: "2",
            title: "Welcome address",
            description:
              "Join our MC and special guests as they officially kick us off and sets the mood for the day.",
            startTime: "10.00",
            endTime: "10:30",
          },
          {
            id: "3",
            title:
              "Profitability: how company culture can drive sustainable growth [Keynote]",
            description:
              "Listen to the inspirational story of our first speaker, overcoming business and finance challenges.",
            startTime: "9:30",
            endTime: "10:00",
          },
          {
            id: "4",
            title: "The changing role of the CFO, with Rita Picarra",
            description:
              "Get to know the peers in the room. An interactive activity to get conversations going before we head into lunch.",
            startTime: "11:15",
            endTime: "11:45",
          },
        ];

  const hasRealData = formData.agenda && formData.agenda.length > 0;

  return (
    <div className={className}>
      {/* Section Title */}
      <h3 className="text-[var(--Title,#1F2024)] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px] mb-6">
        Event Details
      </h3>

      {/* Agenda Items */}
      <div className="space-y-6">
        {agendaItems.map((item, index) => (
          <div key={item.id || index} className="flex items-start gap-4">
            {/* Clock Icon */} 
            <div className="mt-1 flex-shrink-0">
              <ClockIcon />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Title with inline time badges */}
              <div className="flex items-start gap-3 mb-2">
                {/* Time badges */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Start Time */}
                  <div className="inline-flex justify-center items-center px-2 py-1 bg-[#F2F4F7] rounded">
                    <span className="text-[var(--Title,#1F2024)] font-source-sans-pro text-sm font-semibold leading-[142.745%] tracking-[-0.28px]">
                      {formatTime(item.startTime) || "9:30"}
                    </span>
                  </div>

                  {/* End Time */}
                  <div className="inline-flex justify-center items-center px-2 py-1 bg-[#F2F4F7] rounded">
                    <span className="text-[var(--Title,#1F2024)] font-source-sans-pro text-sm font-semibold leading-[142.745%] tracking-[-0.28px]">
                      {formatTime(item.endTime) || "10:00"}
                    </span>
                  </div>
                </div>

                {/* Agenda Title */}
                <h4
                  className={`
                    text-[var(--Title,#1F2024)] 
                    font-source-sans-pro 
                    text-base 
                    font-semibold 
                    leading-[142.745%] 
                    tracking-[-0.32px] 
                    flex-1
                    mt-0.5
                    min-w-0
                    break-words
                    ${!hasRealData ? "text-gray-400" : ""}
                  `}
                >
                  {item.title}
                </h4>
              </div>

              {/* Agenda Description */}
              <p
                className={`
                  text-[var(--body-text,#6B7280)]
                  font-source-sans-pro 
                  text-base 
                  font-normal 
                  leading-[142.745%] 
                  tracking-[-0.32px]
                  ${!hasRealData ? "text-gray-400" : ""}
                `}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder Notice */}
      {!hasRealData && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 font-source-sans-pro">
            <strong>Preview Mode:</strong> Add agenda items in the event
            creation form to see your actual event schedule here.
          </p>
        </div>
      )}
    </div>
  );
}