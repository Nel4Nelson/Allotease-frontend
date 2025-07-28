import React, { useState, useEffect } from "react";
import { TimePicker } from "./time-picker";
import { Button } from "./button";
import { FormInput } from "./form-input";

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

export function AgendaManager({ agenda, onChange }: AgendaManagerProps) {
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

  // Validate current item whenever it changes
  useEffect(() => {
    const errors: typeof validationErrors = {};
    
    if (currentItem.title && currentItem.title.trim().length === 0) {
      errors.title = "Title is required";
    }
    
    if (currentItem.description && currentItem.description.trim().length === 0) {
      errors.description = "Description is required";
    }
    
    if (currentItem.startTime && currentItem.endTime) {
      if (!isEndTimeAfterStartTime(currentItem.startTime, currentItem.endTime)) {
        errors.endTime = "End time must be after start time";
      }
    }
    
    setValidationErrors(errors);
  }, [currentItem]);

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
      
      if (currentItem.startTime && currentItem.endTime && !isEndTimeAfterStartTime(currentItem.startTime, currentItem.endTime)) {
        errors.endTime = "End time must be after start time";
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

  return (
    <div className="space-y-4">
      {/* Display existing agenda items */}
      {agenda.map((item, index) => (
        <div
          key={item.id}
          className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative"
        >
          <button
            type="button"
            onClick={() => removeAgendaItem(item.id)}
            className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            title="Remove agenda item"
          >
            ×
          </button>

          <div className="flex items-center gap-4 mb-2">
            <span className="font-semibold text-lg">{index + 1}.</span>
            <span className="font-medium">{item.title}</span>
            <span className="text-sm text-(--body-text)">
              {formatTimeDisplay(item.startTime)} - {formatTimeDisplay(item.endTime)}
            </span>
          </div>

          <div className="text-(--body-text) pr-8">{item.description}</div>
          
          {/* Show validation warning for existing items */}
          {!isEndTimeAfterStartTime(item.startTime, item.endTime) && (
            <div className="mt-2 text-red-500 text-sm">
              ⚠️ Warning: End time should be after start time
            </div>
          )}
        </div>
      ))}

      {/* Current agenda item form */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 items-start gap-4">
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

          {/* Time Pickers */}
          <div className="flex gap-2">
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
    </div>
  );
}