/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { TimePicker } from "./time-picker";
import { Button } from "./button";
import { FormInput } from "./form-input";
import { EditAgendaModal } from "./modals/edit-agenda-modal";
import { PencilIcon } from "@/components/icons";

export interface AgendaItemData {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

interface AgendaManagerProps {
  agenda: AgendaItemData[];
  onChange: (agenda: AgendaItemData[]) => void;
  eventStartTime?: string; 
  eventEndTime?: string;
  errors?: Record<
    string,
    {
      title?: string;
      description?: string;
      startTime?: string;
      endTime?: string;
    }
  >;
}

export function AgendaManager({ 
  agenda, 
  onChange, 
  eventStartTime = "", 
  eventEndTime = "" 
}: AgendaManagerProps) {
  const [currentItem, setCurrentItem] = useState({
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
    general?: string;
  }>({});

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AgendaItemData | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Helper function to compare times
  const isEndTimeAfterStartTime = (startTime: string, endTime: string): boolean => {
    if (!startTime || !endTime) return true; // Don't validate if either is missing
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    return endMinutes > startMinutes;
  };

  // Helper function to check if agenda time is within event time range
  const isTimeWithinEventRange = (time: string, isStartTime: boolean): boolean => {
    if (!time || !eventStartTime || !eventEndTime) return true; // Don't validate if missing
    
    const [timeHour, timeMinute] = time.split(':').map(Number);
    const [eventStartHour, eventStartMinute] = eventStartTime.split(':').map(Number);
    const [eventEndHour, eventEndMinute] = eventEndTime.split(':').map(Number);
    
    const timeMinutes = timeHour * 60 + timeMinute;
    const eventStartMinutes = eventStartHour * 60 + eventStartMinute;
    const eventEndMinutes = eventEndHour * 60 + eventEndMinute;
    
    if (isStartTime) {
      // Start time should be >= event start time
      return timeMinutes >= eventStartMinutes;
    } else {
      // End time should be <= event end time
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

  // Validate current item whenever it changes
  useEffect(() => {
    const errors: typeof validationErrors = {};
    
    if (currentItem.title && currentItem.title.trim().length === 0) {
      errors.title = "Title is required";
    }
    
    if (currentItem.description && currentItem.description.trim().length === 0) {
      errors.description = "Description is required";
    }
    
    // Validate agenda item times against each other
    if (currentItem.startTime && currentItem.endTime) {
      if (!isEndTimeAfterStartTime(currentItem.startTime, currentItem.endTime)) {
        errors.endTime = "End time must be after start time";
      }
    }
    
    // Validate agenda item times against event times
    if (currentItem.startTime && eventStartTime && eventEndTime) {
      if (!isTimeWithinEventRange(currentItem.startTime, true)) {
        errors.startTime = `Start time must be after event start time (${formatTimeForError(eventStartTime)})`;
      }
    }
    
    if (currentItem.endTime && eventStartTime && eventEndTime) {
      if (!isTimeWithinEventRange(currentItem.endTime, false)) {
        errors.endTime = `End time must be before event end time (${formatTimeForError(eventEndTime)})`;
      }
    }
    
    setValidationErrors(errors);
  }, [currentItem, eventStartTime, eventEndTime]);

  // Check if current item is valid for adding
  const canAddItem = () => {
    return (
      currentItem.title.trim() &&
      currentItem.description.trim() &&
      currentItem.startTime &&
      currentItem.endTime &&
      Object.keys(validationErrors).length === 0
    );
  };

  const addAgendaItem = () => {
    if (!canAddItem()) {
      // Show validation errors
      const errors: typeof validationErrors = {};
      
      if (!currentItem.title.trim()) errors.title = "Title is required";
      if (!currentItem.description.trim()) errors.description = "Description is required";
      if (!currentItem.startTime) errors.startTime = "Start time is required";
      if (!currentItem.endTime) errors.endTime = "End time is required";
      
      // Check time order
      if (currentItem.startTime && currentItem.endTime && !isEndTimeAfterStartTime(currentItem.startTime, currentItem.endTime)) {
        errors.endTime = "End time must be after start time";
      }
      
      // Check event time range
      if (currentItem.startTime && eventStartTime && eventEndTime && !isTimeWithinEventRange(currentItem.startTime, true)) {
        errors.startTime = `Start time must be after event start time (${formatTimeForError(eventStartTime)})`;
      }
      
      if (currentItem.endTime && eventStartTime && eventEndTime && !isTimeWithinEventRange(currentItem.endTime, false)) {
        errors.endTime = `End time must be before event end time (${formatTimeForError(eventEndTime)})`;
      }
      
      setValidationErrors(errors);
      return;
    }

    const newItem: AgendaItemData = {
      id: generateId(),
      title: currentItem.title.trim(),
      description: currentItem.description.trim(),
      startTime: currentItem.startTime,
      endTime: currentItem.endTime,
    };

    onChange([...agenda, newItem]);

    // Clear the form
    setCurrentItem({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
    });
    setValidationErrors({});
  };

  const removeAgendaItem = (id: string) => {
    const updatedAgenda = agenda.filter((item) => item.id !== id);
    onChange(updatedAgenda);
  };

  // Edit functionality
  const openEditModal = (item: AgendaItemData) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleEditSave = (updatedItem: AgendaItemData) => {
    const updatedAgenda = agenda.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    onChange(updatedAgenda);
  };

  // Update handlers with validation
  const handleStartTimeChange = (time: string) => {
    setCurrentItem({ ...currentItem, startTime: time });
  };

  const handleEndTimeChange = (time: string) => {
    setCurrentItem({ ...currentItem, endTime: time });
  };

  const formatTimeDisplay = (time: string) => {
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

  // Check if existing agenda item is within event time range
  const isExistingItemValid = (item: AgendaItemData) => {
    const validStartTime = isTimeWithinEventRange(item.startTime, true);
    const validEndTime = isTimeWithinEventRange(item.endTime, false);
    const validTimeOrder = isEndTimeAfterStartTime(item.startTime, item.endTime);
    
    return validStartTime && validEndTime && validTimeOrder;
  };

  return (
    <div className="space-y-4">
      {/* Event time range info */}
      {eventStartTime && eventEndTime && (
        <div className="bg-gray-50 border border-gray-200  rounded-lg p-3 text-sm">
          <span className="font-medium text-(--body-text)">Event Time:</span>{" "}
          <span className="text-(--body-text)">
            {formatTimeDisplay(eventStartTime)} - {formatTimeDisplay(eventEndTime)}
          </span>
          <div className="text-(--body-text) mt-1">
            All agenda items must fall within this time range.
          </div>
        </div>
      )}

      {/* Display existing agenda items */}
      {agenda.map((item, index) => (
        <div
          key={item.id}
          className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative"
        >
          {/* Action buttons container */}
          <div className="absolute top-2 right-2 flex gap-1">
            {/* Edit button */}
            <button
              type="button"
              onClick={() => openEditModal(item)}
              className="w-7 h-7 bg-gray-50 border rounded-full flex items-center justify-center text-xs transition-colors"
              title="Edit agenda item"
            >
              <PencilIcon />
            </button>

            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeAgendaItem(item.id)}
              className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              title="Remove agenda item"
            >
              ×
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">{index + 1}.</span>
              <span className="font-medium">{item.title}</span>
            </div>
            <span className="text-sm text-(--body-text)">
              {formatTimeDisplay(item.startTime)} - {formatTimeDisplay(item.endTime)}
            </span>
          </div>

          <div className="text-(--body-text) pr-16">{item.description}</div>
          
          {/* Show validation warnings for existing items */}
          {!isExistingItemValid(item) && (
            <div className="mt-2 text-red-500 text-sm">
              ⚠️ Warning: This agenda item has invalid times
              {!isEndTimeAfterStartTime(item.startTime, item.endTime) && (
                <div>• End time should be after start time</div>
              )}
              {eventStartTime && eventEndTime && !isTimeWithinEventRange(item.startTime, true) && (
                <div>• Start time should be after event start time ({formatTimeDisplay(eventStartTime)})</div>
              )}
              {eventStartTime && eventEndTime && !isTimeWithinEventRange(item.endTime, false) && (
                <div>• End time should be before event end time ({formatTimeDisplay(eventEndTime)})</div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Current agenda item form */}
      <div className="space-y-4">
        {/* Title and Time Pickers Row - Responsive */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
          {/* Event Title Section */}
          <div className="flex items-start gap-2">
            <span className="text-[var(--color-dark-slate)] font-source-sans-pro text-lg font-semibold pt-3">
              {agenda.length + 1}.
            </span>
            <div className="flex-1">
              <FormInput
                placeholder="Event title*"
                value={currentItem.title}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, title: e.target.value })
                }
                error={validationErrors.title}
                required
              />
            </div>
          </div>

          {/* Time Pickers Section */}
          <div className="flex gap-3 sm:gap-2">
            <TimePicker
              placeholder="Start time*"
              value={currentItem.startTime}
              onChange={handleStartTimeChange}
              error={validationErrors.startTime}
              required
            />
            <TimePicker
              placeholder="End time*"
              value={currentItem.endTime}
              onChange={handleEndTimeChange}
              error={validationErrors.endTime}
              required
            />
          </div>
        </div>

        {/* Agenda Description */}
        <div>
          <FormInput
            placeholder="Agenda description*"
            value={currentItem.description}
            onChange={(e) =>
              setCurrentItem({ ...currentItem, description: e.target.value })
            }
            error={validationErrors.description}
            required
          />
        </div>

        {/* Validation Summary */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="text-red-500 text-sm">
            Please fix the errors above before adding this agenda item.
          </div>
        )}

        {/* Add Agenda Button */}
        <div>
          <Button
            type="button"
            variant="allotease-blur"
            size="allotease-sm"
            onClick={addAgendaItem}
            disabled={!canAddItem()}
            className={`text-[var(--feature-accent-orange)] ${
              !canAddItem() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={!canAddItem() ? 'Please fill all fields correctly' : 'Add agenda item'}
          >
            Add Agenda
          </Button>
        </div>
      </div>

      {/* Overall validation message */}
      {agenda.length === 0 && (
        <div className="text-gray-500 text-sm text-center py-2">
          Add at least one agenda item to continue
        </div>
      )}

      {/* Edit Modal */}
      <EditAgendaModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSave={handleEditSave}
        agendaItem={editingItem}
        eventStartTime={eventStartTime}
        eventEndTime={eventEndTime}
      />
    </div>
  );
}