/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { TimePicker } from "@/components/ui/time-picker";
import type { AgendaItemData } from "@/components/ui/agenda-manager";

interface EditAgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: AgendaItemData) => void;
  agendaItem: AgendaItemData | null;
  eventStartTime?: string;
  eventEndTime?: string;
  className?: string;
}

export function EditAgendaModal({
  isOpen,
  onClose,
  onSave,
  agendaItem,
  eventStartTime = "",
  eventEndTime = "",
  className = "",
}: EditAgendaModalProps) {
  const [editItem, setEditItem] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
  }>({});

  // Helper function to compare times
  const isEndTimeAfterStartTime = (startTime: string, endTime: string): boolean => {
    if (!startTime || !endTime) return true;
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    return endMinutes > startMinutes;
  };

  // Helper function to check if agenda time is within event time range
  const isTimeWithinEventRange = (time: string, isStartTime: boolean): boolean => {
    if (!time || !eventStartTime || !eventEndTime) return true;
    
    const [timeHour, timeMinute] = time.split(':').map(Number);
    const [eventStartHour, eventStartMinute] = eventStartTime.split(':').map(Number);
    const [eventEndHour, eventEndMinute] = eventEndTime.split(':').map(Number);
    
    const timeMinutes = timeHour * 60 + timeMinute;
    const eventStartMinutes = eventStartHour * 60 + eventStartMinute;
    const eventEndMinutes = eventEndHour * 60 + eventEndMinute;
    
    if (isStartTime) {
      return timeMinutes >= eventStartMinutes;
    } else {
      return timeMinutes <= eventEndMinutes;
    }
  };

  // Format time for display in error messages
  const formatTimeForError = (time: string) => {
    if (!time) return "";
    try {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return time;
    }
  };

  // Initialize form when modal opens or agenda item changes
  useEffect(() => {
    if (isOpen && agendaItem) {
      setEditItem({
        title: agendaItem.title,
        description: agendaItem.description,
        startTime: agendaItem.startTime,
        endTime: agendaItem.endTime,
      });
      setValidationErrors({});
    }
  }, [isOpen, agendaItem]);

  // Validate form whenever editItem changes
  useEffect(() => {
    const errors: typeof validationErrors = {};
    
    if (editItem.title && editItem.title.trim().length === 0) {
      errors.title = "Title is required";
    }
    
    if (editItem.description && editItem.description.trim().length === 0) {
      errors.description = "Description is required";
    }
    
    // Validate agenda item times against each other
    if (editItem.startTime && editItem.endTime) {
      if (!isEndTimeAfterStartTime(editItem.startTime, editItem.endTime)) {
        errors.endTime = "End time must be after start time";
      }
    }
    
    // Validate agenda item times against event times
    if (editItem.startTime && eventStartTime && eventEndTime) {
      if (!isTimeWithinEventRange(editItem.startTime, true)) {
        errors.startTime = `Start time must be after event start time (${formatTimeForError(eventStartTime)})`;
      }
    }
    
    if (editItem.endTime && eventStartTime && eventEndTime) {
      if (!isTimeWithinEventRange(editItem.endTime, false)) {
        errors.endTime = `End time must be before event end time (${formatTimeForError(eventEndTime)})`;
      }
    }
    
    setValidationErrors(errors);
  }, [editItem, eventStartTime, eventEndTime]);

  // Check if form is valid for saving
  const canSave = () => {
    return (
      editItem.title.trim() &&
      editItem.description.trim() &&
      editItem.startTime &&
      editItem.endTime &&
      Object.keys(validationErrors).length === 0
    );
  };

  const handleSave = () => {
    if (!canSave() || !agendaItem) {
      // Show validation errors
      const errors: typeof validationErrors = {};
      
      if (!editItem.title.trim()) errors.title = "Title is required";
      if (!editItem.description.trim()) errors.description = "Description is required";
      if (!editItem.startTime) errors.startTime = "Start time is required";
      if (!editItem.endTime) errors.endTime = "End time is required";
      
      // Check time order
      if (editItem.startTime && editItem.endTime && !isEndTimeAfterStartTime(editItem.startTime, editItem.endTime)) {
        errors.endTime = "End time must be after start time";
      }
      
      // Check event time range
      if (editItem.startTime && eventStartTime && eventEndTime && !isTimeWithinEventRange(editItem.startTime, true)) {
        errors.startTime = `Start time must be after event start time (${formatTimeForError(eventStartTime)})`;
      }
      
      if (editItem.endTime && eventStartTime && eventEndTime && !isTimeWithinEventRange(editItem.endTime, false)) {
        errors.endTime = `End time must be before event end time (${formatTimeForError(eventEndTime)})`;
      }
      
      setValidationErrors(errors);
      return;
    }

    const updatedItem: AgendaItemData = {
      id: agendaItem.id,
      title: editItem.title.trim(),
      description: editItem.description.trim(),
      startTime: editItem.startTime,
      endTime: editItem.endTime,
    };

    onSave(updatedItem);
    onClose();
  };

  const handleClose = () => {
    setEditItem({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
    });
    setValidationErrors({});
    onClose();
  };

  if (!isOpen || !agendaItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20" 
        onClick={handleClose}
        style={{ zIndex: 1 }}
      />

      {/* Modal */}
      <div
        className={`relative ${className}`}
        style={{
          borderRadius: "20px",
          background: "rgba(242, 244, 247, 0.60)",
          boxShadow: "0 4px 10px 0 rgba(0, 0, 0, 0.04)",
          backdropFilter: "blur(83.3499984741211px)",
          display: "flex",
          width: "600px",
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "20px",
          justifyContent: "center",
          alignItems: "center",
          gap: "40px",
          zIndex: 2,
        }}
      >
        {/* Close Button */}
        <div
          className="absolute top-4 right-4"
          style={{ zIndex: 50 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClose();
          }}
        >
          <button
            type="button"
            className="p-3 hover:bg-black/5 rounded-full transition-colors"
            style={{ 
              minWidth: "44px", 
              minHeight: "44px",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
              background: "transparent",
              border: "none",
              cursor: "pointer"
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Background Gradient Container */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.6,
            background:
              "linear-gradient(354deg, #FFF 24.04%, rgba(255, 243, 230, 0.35) 59.41%, #D5FFEB 113.97%)",
            filter: "blur(18.285715103149414px)",
            borderRadius: "20px",
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full space-y-6 py-8">

          {/* Title */}
          <h2
            style={{
              color: "var(--Title, #1F2024)",
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "140%",
              letterSpacing: "-0.4px",
              margin: 0,
            }}
          >
            Edit Agenda Item
          </h2>

          {/* Event time range info */}
          {eventStartTime && eventEndTime && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm w-full max-w-md">
              <span className="font-medium text-(--body-text)">Event Time:</span>{" "}
              <span className="text-(--body-text)">
                {formatTimeForError(eventStartTime)} - {formatTimeForError(eventEndTime)}
              </span>
              <div className="text-(--body-text) mt-1 text-xs">
                All agenda items must fall within this time range.
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="w-full max-w-md space-y-4">
            {/* Title */}
            <FormInput
              placeholder="Event title*"
              value={editItem.title}
              onChange={(e) =>
                setEditItem({ ...editItem, title: e.target.value })
              }
              error={validationErrors.title}
              required
            />

            {/* Description */}
            <FormInput
              placeholder="Agenda description*"
              value={editItem.description}
              onChange={(e) =>
                setEditItem({ ...editItem, description: e.target.value })
              }
              error={validationErrors.description}
              required
            />

            {/* Time Pickers */}
            <div className="flex gap-3">
              <TimePicker
                placeholder="Start time*"
                value={editItem.startTime}
                onChange={(time) =>
                  setEditItem({ ...editItem, startTime: time })
                }
                error={validationErrors.startTime}
                required
              />
              <TimePicker
                placeholder="End time*"
                value={editItem.endTime}
                onChange={(time) =>
                  setEditItem({ ...editItem, endTime: time })
                }
                error={validationErrors.endTime}
                required
              />
            </div>

            {/* Validation Summary */}
            {Object.keys(validationErrors).length > 0 && (
              <div className="text-red-500 text-sm text-center">
                Please fix the errors above before saving.
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleClose}
              style={{
                background: "transparent",
                borderRadius: "51px",
                padding: "12px 24px",
                color: "#71727A",
                fontSize: "16px",
                fontWeight: 600,
                fontFamily: "var(--font-source-sans), sans-serif",
                border: "2px solid #E5E5E5",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f5f5f5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              disabled={!canSave()}
              style={{
                background: canSave() ? "#FF5B06" : "#ccc",
                borderRadius: "51px",
                padding: "12px 24px",
                color: "white",
                fontSize: "16px",
                fontWeight: 600,
                fontFamily: "var(--font-source-sans), sans-serif",
                border: "none",
                cursor: canSave() ? "pointer" : "not-allowed",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (canSave()) {
                  e.currentTarget.style.background = "#E54A00";
                }
              }}
              onMouseLeave={(e) => {
                if (canSave()) {
                  e.currentTarget.style.background = "#FF5B06";
                }
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}