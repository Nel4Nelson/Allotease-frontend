"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { EventFormData, CreateEventStepProps } from "@/types/events";

const dateTimeSchema = z.object({
  startTime: z
    .string()
    .min(1, "Start date and time is required")
    .refine((val) => {
      const date = new Date(val);
      return date > new Date();
    }, "Start time must be in the future"),
  
  endTime: z
    .string()
    .min(1, "End date and time is required")
    .optional(),
}).refine((data) => {
  if (data.endTime) {
    const startDate = new Date(data.startTime);
    const endDate = new Date(data.endTime);
    return endDate > startDate;
  }
  return true;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

type DateTimeFormData = z.infer<typeof dateTimeSchema>;

export function DateTimeStep({ data, onNext, onBack, isLoading }: CreateEventStepProps) {
  // Format datetime-local input value
  const formatDateTimeLocal = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<DateTimeFormData>({
    resolver: zodResolver(dateTimeSchema),
    mode: "onChange",
    defaultValues: {
      startTime: formatDateTimeLocal(data.startTime || ""),
      endTime: formatDateTimeLocal(data.endTime || ""),
    },
  });

  const onSubmit = (formData: DateTimeFormData) => {
    // Convert to ISO format for API
    const stepData: Partial<EventFormData> = {
      startTime: new Date(formData.startTime).toISOString(),
      endTime: formData.endTime ? new Date(formData.endTime).toISOString() : undefined,
    };
    onNext(stepData);
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold font-space-grotesk text-[var(--title-color)]">
          When does your event start and end?
        </h2>
        <p className="text-[var(--body-text)] font-source-sans-pro">
          Tell event-goers when your event starts and ends so they can make plans to attend.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Date & Time Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold font-space-grotesk text-[var(--title-color)]">
            Date & Time
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--title-color)] font-source-sans-pro">
                Event starts <span className="text-red-500">*</span>
              </label>
              <FormInput
                type="datetime-local"
                placeholder="Select start date and time"
                error={errors.startTime?.message}
                {...register("startTime")}
              />
            </div>

            {/* End Date Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--title-color)] font-source-sans-pro">
                Event ends
              </label>
              <FormInput
                type="datetime-local"
                placeholder="Select end date and time"
                error={errors.endTime?.message}
                {...register("endTime")}
              />
            </div>
          </div>
          
          <p className="text-xs text-[var(--body-text)] font-source-sans-pro">
            End time is optional. If not specified, attendees will know when the event starts but not when it ends.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="px-8"
          >
            ← Back
          </Button>
          
          <Button
            type="submit"
            variant="signup-primary"
            size="allotease-lg"
            className="px-8"
            disabled={!isValid || isLoading}
            loading={isLoading}
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}