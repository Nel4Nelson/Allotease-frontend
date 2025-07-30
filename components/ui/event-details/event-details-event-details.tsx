import React from "react";

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

interface AgendaItem {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

interface EventDetailsEventDetailsProps {
  agenda?: AgendaItem[];
  className?: string;
}

export function EventDetailsEventDetails({
  agenda,
  className = "",
}: EventDetailsEventDetailsProps) {
  // Format time from ISO string to HH:MM format
  const formatTime = (isoTime: string): string => {
    if (!isoTime) return "";
    try {
      const date = new Date(isoTime);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  };

  // Check if we have agenda data
  const hasAgendaData = agenda && agenda.length > 0;

  return (
    <div className={className}>
      {/* Section Title */}
      <h3 className="text-[var(--Title,#1F2024)] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px] mb-6">
        Event Details
      </h3>

      {hasAgendaData ? (
        /* Agenda Items */
        <div className="space-y-6">
          {agenda.map((item) => (
            <div key={item._id} className="flex items-start gap-4">
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
                        {formatTime(item.startTime)}
                      </span>
                    </div>

                    {/* End Time */}
                    <div className="inline-flex justify-center items-center px-2 py-1 bg-[#F2F4F7] rounded">
                      <span className="text-[var(--Title,#1F2024)] font-source-sans-pro text-sm font-semibold leading-[142.745%] tracking-[-0.28px]">
                        {formatTime(item.endTime)}
                      </span>
                    </div>
                  </div>

                  {/* Agenda Title */}
                  <h4 className="text-[var(--Title,#1F2024)] font-source-sans-pro text-base font-semibold leading-[142.745%] tracking-[-0.32px] flex-1 mt-0.5 min-w-0 break-words">
                    {item.title}
                  </h4>
                </div>

                {/* Agenda Description */}
                <p className="text-[var(--body-text,#6B7280)] font-source-sans-pro text-base font-normal leading-[142.745%] tracking-[-0.32px]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* No Data Message */
        <div className="text-center py-8">
          <p className="text-[var(--body-text,#6B7280)] font-source-sans-pro text-base font-normal leading-[142.745%] tracking-[-0.32px]">
            No event details available for this event.
          </p>
        </div>
      )}
    </div>
  );
}
