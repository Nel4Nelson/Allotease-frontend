/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
// /components/features/create/events/form-sections/basic-info-step.tsx
"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { FormSelect } from "@/components/ui/form-select";
import { FormFileUpload } from "@/components/ui/form-file-upload";
import { MapPicker } from "@/components/ui/map-picker";
import { EventFormData, CreateEventStepProps } from "@/types/events";

const basicInfoSchema = z
  .object({
    title: z
      .string()
      .min(1, "Event title is required")
      .min(3, "Event title must be at least 3 characters")
      .max(100, "Event title must not exceed 100 characters"),

    description: z
      .string()
      .min(1, "Event description is required")
      .min(10, "Event description must be at least 10 characters")
      .max(1000, "Event description must not exceed 1000 characters"),

    eventType: z.enum(["remote", "venue"], {
      required_error: "Please select an event type",
    }),

    location: z
      .object({
        address: z.string(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        placeName: z.string().optional(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      // If event type is venue, location is required
      if (data.eventType === "venue") {
        return data.location && data.location.address.length > 0;
      }
      return true;
    },
    {
      message: "Location is required for venue events",
      path: ["location"],
    }
  );

type BasicInfoFormData = z.infer<typeof basicInfoSchema> & {
  image?: File;
};

export function BasicInfoStep({
  data,
  onNext,
  isLoading,
}: CreateEventStepProps) {
  const [selectedImage, setSelectedImage] = React.useState<File | null>(
    data.image || null
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    mode: "onChange",
    defaultValues: {
      title: data.title || "",
      description: data.description || "",
      eventType: data.eventType || "remote",
      location: data.location,
    },
  });

  const watchedEventType = watch("eventType");

  const eventTypeOptions = [
    { value: "remote", label: "Online Event" },
    { value: "venue", label: "Venue Event" },
  ];

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file);
  };

  const handleLocationChange = (location: any) => {
    setValue("location", location, { shouldValidate: true });
  };

  const onSubmit = (formData: BasicInfoFormData) => {
    const stepData: Partial<EventFormData> = {
      ...formData,
      image: selectedImage || undefined,
    };
    onNext(stepData);
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold font-space-grotesk text-[var(--title-color)]">
          What's the name of your event?
        </h2>
        <p className="text-[var(--body-text)] font-source-sans-pro">
          This will be your event's title. Your title will be used to help
          create your event's summary, description, category, and tags — so be
          specific!
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Event Title */}
        <FormInput
          label="Event Title"
          placeholder="Event Title*"
          error={errors.title?.message}
          {...register("title")}
        />

        {/* Event Description */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold font-space-grotesk text-[var(--title-color)]">
            Tell more about the event?
          </h3>
          <FormTextarea
            label="Event Description"
            placeholder="Event description*"
            error={errors.description?.message}
            rows={5}
            {...register("description")}
          />
        </div>

        {/* Cover Image Upload */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold font-space-grotesk text-[var(--title-color)]">
            Upload a cover image
          </h3>
          <p className="text-sm text-[var(--body-text)] font-source-sans-pro mb-3">
            This image will be the main visual representation of your event.
            Choose a clear, high-quality photo that best showcases the space to
            attract users' attention.
            <br />
            <span className="text-xs">
              Recommended dimensions: 1200 x 800 pixels for optimal display
            </span>
          </p>
          <FormFileUpload
            label="Cover Image"
            placeholder="Upload Image*"
            accept="image/*"
            value={selectedImage}
            onChange={handleImageChange}
          />
        </div>

        {/* Event Type Selection */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold font-space-grotesk text-[var(--title-color)]">
            Where is it located?
          </h3>
          <FormSelect
            label="Event Type"
            placeholder="Select event type*"
            options={eventTypeOptions}
            error={errors.eventType?.message}
            {...register("eventType")}
          />
        </div>

        {/* Location Picker - Only show for venue events */}
        {watchedEventType === "venue" && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold font-space-grotesk text-[var(--title-color)]">
              Event Location
            </h3>
            <MapPicker
              label="Find Location"
              placeholder="Find location*"
              value={data.location}
              onChange={handleLocationChange}
              error={errors.location?.message}
              required
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            variant="signup-primary"
            size="allotease-lg"
            className="w-full sm:w-auto px-8"
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
