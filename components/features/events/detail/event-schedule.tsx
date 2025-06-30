"use client";
import React from "react";
import { EventScheduleProps } from "@/types/event-details";
import { Clock } from "lucide-react";

export function EventSchedule({
  schedule,
  title = "Event Details",
}: EventScheduleProps) {
  const getScheduleIcon = (type?: string) => {
    switch (type) {
      case "registration":
        return (
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,128a104,104,0,0,1-206.33,15.56L27.23,131.12a87.25,87.25,0,0,0,0,9.76l-9.56,12.44A104,104,0,0,1,224,128ZM32.33,112.44L41.89,100a87.25,87.25,0,0,0,0-9.76L32.33,77.56A104,104,0,0,1,224,128,103.33,103.33,0,0,1,32.33,112.44ZM128,24A104,104,0,0,1,232,128a8,8,0,0,1-16,0,88,88,0,1,0-88,88,8,8,0,0,1,0,16A104,104,0,0,1,128,24Z" />
          </svg>
        );
      case "break":
        return (
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
            <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H216V88H40ZM40,200V104H216v96Z" />
          </svg>
        );
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case "registration":
        return "text-blue-600 bg-blue-50";
      case "break":
        return "text-green-600 bg-green-50";
      case "networking":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-[#FF5B00] bg-orange-50";
    }
  };

  return (
    <div className="py-6 border-b border-gray-200">
      <h3 className="text-[#1F2024] font-bold text-xl mb-6">{title}</h3>

      <div className="space-y-6">
        {schedule.map((item) => (
          <div key={item.id} className="flex items-start gap-4">
            {/* Time Badge */}
            <div
              className={`flex items-center gap-2 ${getTypeColor(
                item.type
              )} px-3 py-1 rounded-full flex-shrink-0`}
            >
              {getScheduleIcon(item.type)}
              <span className="text-sm font-medium">
                {item.startTime} - {item.endTime}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-[#1F2024] font-semibold text-base mb-2">
                {item.title}
              </h4>
              <p className="text-[#71727A] text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
