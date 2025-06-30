/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { FormFileUpload } from "@/components/ui/form-file-upload";
import { MapPicker } from "@/components/ui/map-picker";
import { AgendaBuilder } from "./components/agenda-builder";
import { TagSelector } from "./components/tag-selector";
import { EventService } from "@/services/event-service";
import { AgendaItem, EventLocation, CreateEventRequest } from "@/types/events";
import { ApiError } from "@/services/api-client";

const eventFormSchema = z
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

    startDate: z.string().min(1, "Event date is required"),

    startTime: z.string().min(1, "Start time is required"),

    endTime: z.string().optional(),

    eventType: z.enum(["remote", "venue"], {
      required_error: "Please select event location type",
    }),

    location: z
      .object({
        address: z.string(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        placeName: z.string().optional(),
      })
      .optional(),

    capacity: z
      .number()
      .min(1, "Capacity must be at least 1")
      .max(10000, "Capacity cannot exceed 10,000"),

    price: z
      .number()
      .min(0, "Price cannot be negative")
      .max(1000000, "Price cannot exceed 1,000,000"),

    isFree: z.boolean(),
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

type EventFormSchemaData = z.infer<typeof eventFormSchema>;

export function SingleFormEventCreation() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [agenda, setAgenda] = useState<AgendaItem[]>([
    {
      startTime: "",
      endTime: "",
      title: "",
      description: "",
    },
  ]);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<EventFormSchemaData>({
    resolver: zodResolver(eventFormSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      startTime: "",
      endTime: "",
      eventType: "remote",
      capacity: 50,
      price: 0,
      isFree: false,
    },
  });

  const watchedEventType = watch("eventType");
  const watchedIsFree = watch("isFree");

  React.useEffect(() => {
    if (watchedIsFree) {
      setValue("price", 0);
    }
  }, [watchedIsFree, setValue]);

  const handleLocationChange = (location: EventLocation) => {
    setValue("location", location, { shouldValidate: true });
  };

  const handleFreeToggle = (checked: boolean) => {
    setValue("isFree", checked, { shouldValidate: true });
    if (checked) {
      setValue("price", 0, { shouldValidate: true });
    }
  };

  const onSubmit = async (formData: EventFormSchemaData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate agenda and tags
      if (agenda.length === 0 || !agenda.some((item) => item.title.trim())) {
        throw new Error("At least one agenda item is required");
      }

      if (tags.length === 0) {
        throw new Error("At least one tag is required");
      }

      // Combine date and time
      const startDateTime = new Date(
        `${formData.startDate}T${formData.startTime}`
      ).toISOString();
      // const endDateTime = formData.endTime
      //   ? new Date(`${formData.startDate}T${formData.endTime}`).toISOString()
      //   : undefined;

      // Prepare data for API
      const eventData: CreateEventRequest = {
        title: formData.title,
        description: formData.description,
        eventType: formData.eventType,
        startTime: startDateTime,
        price: formData.price,
        capacity: formData.capacity,
        agenda: agenda.filter(
          (item) => item.title.trim() && item.description.trim()
        ),
        tags: tags,
        image: selectedImage || undefined,
        location:
          formData.eventType === "venue" ? formData.location : undefined,
      };

      const response = await EventService.createEvent(eventData);

      if (response.status === "success") {
        // Redirect to preview or success page
        router.push(
          `/events/${response.data?.id || response.data?.slug || ""}`
        );
      } else {
        setError("Failed to create event. Please try again.");
      }
    } catch (error) {
      console.error("Create event error:", error);

      const apiError = error as ApiError;
      setError(apiError.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-source-sans-pro">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Event Title */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold font-space-grotesk text-[var(--title-color)]">
            What's the name of your event?
          </h2>
          <p className="text-[var(--body-text)] font-source-sans-pro">
            This will be your event's title. Your title will be used to help
            create your event's summary, description, category, and tags — so be
            specific!
          </p>
          <FormInput
            placeholder="Event title*"
            error={errors.title?.message}
            {...register("title")}
          />
        </div>

        {/* Event Description */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold font-space-grotesk text-[var(--title-color)]">
            Tell more about the event?
          </h2>
          <FormTextarea
            placeholder="Event description*"
            rows={5}
            error={errors.description?.message}
            {...register("description")}
          />
        </div>

        {/* Cover Image */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold font-space-grotesk text-[var(--title-color)]">
            Upload a cover image
          </h2>
          <p className="text-[var(--body-text)] font-source-sans-pro">
            This image will be the main visual representation of your event.
            Choose a clear, high-quality photo that best showcases the space to
            attract users' attention.
            <br />
            <span className="text-sm">
              Recommended dimensions: 1200 x 800 pixels for optimal display
            </span>
          </p>
          <FormFileUpload
            placeholder="Upload Image*"
            accept="image/*"
            value={selectedImage}
            onChange={setSelectedImage}
          />
        </div>

        {/* Date and Time */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold font-space-grotesk text-[var(--title-color)]">
            When does your event start and end?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              type="date"
              placeholder="Date*"
              error={errors.startDate?.message}
              {...register("startDate")}
            />
            <FormInput
              type="time"
              placeholder="Start time*"
              error={errors.startTime?.message}
              {...register("startTime")}
            />
            <FormInput
              type="time"
              placeholder="End time"
              error={errors.endTime?.message}
              {...register("endTime")}
            />
          </div>
        </div>

        {/* Agenda */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold font-space-grotesk text-[var(--title-color)]">
            Fill out the agenda of your event
          </h2>
          <AgendaBuilder value={agenda} onChange={setAgenda} />
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold font-space-grotesk text-[var(--title-color)]">
            When does your event start and end?
          </h2>
          <p className="text-[var(--body-text)] font-source-sans-pro">
            This will be your event's title. Your title will be used to help
            create your event's summary, description, category, and tags — so be
            specific!
          </p>
          <FormInput placeholder="Enter category*" className="mb-4" />
          <TagSelector value={tags} onChange={setTags} />
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold font-space-grotesk text-[var(--title-color)]">
            Where is it located?
          </h2>

          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setValue("eventType", "remote")}
              className={`px-6 py-2 rounded-md font-source-sans-pro ${
                watchedEventType === "remote"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Online
            </button>
            <button
              type="button"
              onClick={() => setValue("eventType", "venue")}
              className={`px-6 py-2 rounded-md font-source-sans-pro ${
                watchedEventType === "venue"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Venue
            </button>
          </div>

          {watchedEventType === "venue" && (
            <div className="space-y-4">
              <FormInput placeholder="Find location*" />
              <MapPicker
                placeholder="Find location*"
                onChange={handleLocationChange}
                error={errors.location?.message}
              />
            </div>
          )}
        </div>

        {/* Capacity */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold font-space-grotesk text-[var(--title-color)]">
            What's the capacity for your event?
          </h2>
          <p className="text-[var(--body-text)] font-source-sans-pro">
            Event capacity is the total number of tickets you're willing to
            sell.
          </p>
          <div className="max-w-xs">
            <FormInput
              type="number"
              placeholder="Total capacity*"
              min="1"
              max="10000"
              error={errors.capacity?.message}
              {...register("capacity", { valueAsNumber: true })}
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold font-space-grotesk text-[var(--title-color)]">
            How much do you want to charge for tickets?
          </h2>
          <p className="text-[var(--body-text)] font-source-sans-pro">
            Our tool can only generate one General Admission ticket for now. You
            can edit and add more ticket types later.
          </p>

          {!watchedIsFree && (
            <div className="max-w-xs">
              <FormInput
                type="number"
                placeholder="Price*"
                min="0"
                step="0.01"
                error={errors.price?.message}
                {...register("price", { valueAsNumber: true })}
              />
            </div>
          )}

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="free-event"
              checked={watchedIsFree}
              onChange={(e) => handleFreeToggle(e.target.checked)}
              className="w-4 h-4 text-[var(--feature-accent-orange)] bg-white border-2 border-[var(--input-border)] rounded focus:ring-[var(--feature-accent-orange)] focus:ring-2"
            />
            <label
              htmlFor="free-event"
              className="font-source-sans-pro text-[var(--title-color)]"
            >
              My event is free
            </label>
            <div className="w-3 h-3 bg-[var(--feature-accent-orange)] rounded-full"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-8">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="px-8"
          >
            Exit
          </Button>

          <Button
            type="submit"
            className="px-8 bg-[var(--feature-accent-orange)] hover:bg-[var(--feature-accent-orange)]/90 text-white"
            disabled={!isValid || isLoading}
            loading={isLoading}
          >
            Preview Event
          </Button>
        </div>
      </form>
    </div>
  );
}
