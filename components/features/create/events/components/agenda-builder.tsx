// /components/features/create/events/components/agenda-builder.tsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { AgendaItem } from "@/types/events";

interface AgendaBuilderProps {
  value: AgendaItem[];
  onChange: (agenda: AgendaItem[]) => void;
  error?: string;
}

export function AgendaBuilder({ value, onChange, error }: AgendaBuilderProps) {
  const [agenda, setAgenda] = useState<AgendaItem[]>(
    value.length > 0
      ? value
      : [
          {
            startTime: "",
            endTime: "",
            title: "",
            description: "",
          },
        ]
  );

  const updateAgenda = (newAgenda: AgendaItem[]) => {
    setAgenda(newAgenda);
    onChange(newAgenda);
  };

  const addAgendaItem = () => {
    const newItem: AgendaItem = {
      startTime: "",
      endTime: "",
      title: "",
      description: "",
    };
    updateAgenda([...agenda, newItem]);
  };

  const removeAgendaItem = (index: number) => {
    if (agenda.length > 1) {
      const newAgenda = agenda.filter((_, i) => i !== index);
      updateAgenda(newAgenda);
    }
  };

  const updateAgendaItem = (
    index: number,
    field: keyof AgendaItem,
    value: string
  ) => {
    const newAgenda = agenda.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    updateAgenda(newAgenda);
  };

  const formatTimeForInput = (timeString: string) => {
    if (!timeString) return "";
    // Handle both ISO string and time-only formats
    try {
      const date = new Date(timeString);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    } catch {
      return timeString;
    }
  };

  const formatTimeForStorage = (timeString: string, baseDate?: string) => {
    if (!timeString) return "";

    // If it's already an ISO string, return as is
    if (timeString.includes("T")) return timeString;

    // Create a proper datetime string
    const today = baseDate ? new Date(baseDate) : new Date();
    const [hours, minutes] = timeString.split(":");
    const date = new Date(today);
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date.toISOString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold font-space-grotesk text-[var(--title-color)]">
          Fill out the agenda of your event
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addAgendaItem}
          className="text-[var(--feature-accent-orange)] border-[var(--feature-accent-orange)]"
        >
          + Add Agenda
        </Button>
      </div>

      <div className="space-y-6">
        {agenda.map((item, index) => (
          <div
            key={index}
            className="border border-[var(--input-border)] rounded-lg p-4 space-y-4"
          >
            {/* Agenda Item Header */}
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-[var(--title-color)] font-source-sans-pro">
                {index + 1}.
              </h4>
              {agenda.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAgendaItem(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              )}
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--title-color)] font-source-sans-pro">
                  Start time <span className="text-red-500">*</span>
                </label>
                <FormInput
                  type="time"
                  value={formatTimeForInput(item.startTime)}
                  onChange={(e) => {
                    const formattedTime = formatTimeForStorage(e.target.value);
                    updateAgendaItem(index, "startTime", formattedTime);
                  }}
                  placeholder="Start time"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--title-color)] font-source-sans-pro">
                  End time <span className="text-red-500">*</span>
                </label>
                <FormInput
                  type="time"
                  value={formatTimeForInput(item.endTime)}
                  onChange={(e) => {
                    const formattedTime = formatTimeForStorage(e.target.value);
                    updateAgendaItem(index, "endTime", formattedTime);
                  }}
                  placeholder="End time"
                />
              </div>
            </div>

            {/* Title */}
            <FormInput
              placeholder="Event title*"
              value={item.title}
              onChange={(e) => updateAgendaItem(index, "title", e.target.value)}
            />

            {/* Description */}
            <FormTextarea
              placeholder="Agenda description*"
              value={item.description}
              onChange={(e) =>
                updateAgendaItem(index, "description", e.target.value)
              }
              rows={3}
            />
          </div>
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-sm font-source-sans-pro" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
