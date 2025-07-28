/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { Suspense } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
  AgendaManager,
  type AgendaItemData,
} from "@/components/ui/agenda-manager";
import { Divider } from "@/components/ui/divider";
import { CategorySelector } from "@/components/ui/category-selector";
import {
  LocationSelector,
  type LocationData,
  type EventType,
} from "@/components/ui/location-selector";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedFormStore } from "@/hooks/use-debounced-form-store";
import { debounce } from "lodash";

const eventsFormSchema = z
  .object({
    eventTitle: z
      .string()
      .min(1, { message: "Event title is required." })
      .max(100, { message: "Title must not exceed 100 characters." }),
    eventDescription: z
      .string()
      .min(1, { message: "Event description is required." })
      .max(1000, { message: "Description must not exceed 1000 characters." }),
    image: z
      .array(z.instanceof(File))
      .min(1, { message: "A cover image is required." })
      .max(1, { message: "Only one image allowed." }),
    eventDate: z.date({ message: "Event date is required." }),
    startTime: z.string().min(1, { message: "Start time is required." }),
    endTime: z.string().min(1, { message: "End time is required." }),
    agenda: z
      .array(
        z.object({
          id: z.string(),
          title: z.string().min(1, { message: "Agenda title is required." }),
          description: z
            .string()
            .min(1, { message: "Agenda description is required." }),
          startTime: z.string().min(1, { message: "Start time is required." }),
          endTime: z.string().min(1, { message: "End time is required." }),
        })
      )
      .min(1, { message: "At least one agenda item is required." }),
    categories: z
      .array(z.string())
      .min(1, { message: "At least one category is required." }),
    eventType: z.enum(["remote", "venue"], {
      message: "Event type is required.",
    }),
    location: z
      .object({
        address: z.string().min(1, { message: "Address is required." }),
        city: z.string().min(1, { message: "City is required." }),
        state: z.string().min(1, { message: "State is required." }),
        country: z.string().min(1, { message: "Country is required." }),
      })
      .optional(),
    capacity: z
      .number()
      .min(1, { message: "Capacity is required." })
      .max(100000, { message: "Capacity cannot exceed 100,000." }),
    price: z.number().min(0),
    isFree: z.boolean(),
  })
  .refine(
    (data) => {
      // If eventType is venue, location is required
      if (data.eventType === "venue" && !data.location) {
        return false;
      }
      return true;
    },
    {
      message: "Location is required for venue events.",
      path: ["location"],
    }
  )
  .refine(
    (data) => {
      // If event is not free, price must be greater than 0
      if (!data.isFree && data.price <= 0) {
        return false;
      }
      return true;
    },
    {
      message: "Price is required for paid events.",
      path: ["price"],
    }
  );

export interface EventsFormData {
  eventTitle: string;
  eventDescription: string;
  image: File[];
  eventDate: Date;
  startTime: string;
  endTime: string;
  agenda: AgendaItemData[];
  categories: string[];
  eventType: EventType;
  location?: LocationData;
  capacity: number;
  price: number;
  isFree: boolean;
}

// Component that uses useSearchParams
function EventsFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Zustand store integration
  const { formData: storeData, updateFormDataImmediate, updateFormDataDebounced } = useDebouncedFormStore();
  
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventsFormData>({
    resolver: zodResolver(eventsFormSchema),
    mode: "onChange",
    defaultValues: {
      eventTitle: storeData.eventTitle || "",
      eventDescription: storeData.eventDescription || "",
      image: storeData.image || [],
      eventDate: storeData.eventDate || undefined,
      startTime: storeData.startTime || "",
      endTime: storeData.endTime || "",
      agenda: storeData.agenda || [],
      categories: storeData.categories || [],
      eventType: storeData.eventType || "remote",
      location: storeData.location || undefined,
      capacity: storeData.capacity || 0,
      price: storeData.price || 0,
      isFree: storeData.isFree ?? true,
    },
  });

  const eventDate = watch("eventDate");
  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const agenda = watch("agenda");
  const categories = watch("categories");
  const eventType = watch("eventType");
  const location = watch("location");
  const capacity = watch("capacity");
  const price = watch("price");
  const isFree = watch("isFree");
  
  // Watch for text input changes
  const eventTitle = watch("eventTitle");
  const eventDescription = watch("eventDescription");

  const handleImageChange = (images: File[]) => {
    setValue("image", images, { shouldValidate: true });
    // Immediately sync to store for files
    updateFormDataImmediate({ image: images });
  };

  const handleDateChange = (date: Date | undefined) => {
    setValue("eventDate", date!, { shouldValidate: true });
    // Immediately sync critical data
    updateFormDataImmediate({ eventDate: date! });
  };

  const handleStartTimeChange = (time: string) => {
    setValue("startTime", time, { shouldValidate: true });
    updateFormDataDebounced({ startTime: time });
  };

  const handleEndTimeChange = (time: string) => {
    setValue("endTime", time, { shouldValidate: true });
    updateFormDataDebounced({ endTime: time });
  };

  const handleAgendaChange = (newAgenda: AgendaItemData[]) => {
    setValue("agenda", newAgenda, { shouldValidate: true });
    updateFormDataImmediate({ agenda: newAgenda });
  };

  const handleCategoriesChange = (selectedCategories: string[]) => {
    setValue("categories", selectedCategories, { shouldValidate: true });
    updateFormDataImmediate({ categories: selectedCategories });
  };

  const handleEventTypeChange = (newEventType: EventType) => {
    setValue("eventType", newEventType, { shouldValidate: true });
    updateFormDataImmediate({ eventType: newEventType });

    // Clear location when switching to remote
    if (newEventType === "remote") {
      setValue("location", undefined, { shouldValidate: true });
      updateFormDataImmediate({ location: undefined });
    }
  };

  const handleLocationChange = (selectedLocation: LocationData | null) => {
    setValue("location", selectedLocation || undefined, {
      shouldValidate: true,
    });
    updateFormDataImmediate({ location: selectedLocation || undefined });
  };

  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value ? parseInt(value, 10) : 0;
    setValue("capacity", numValue, { shouldValidate: true });
    updateFormDataDebounced({ capacity: numValue });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value ? parseFloat(value) : 0;
    setValue("price", numValue, { shouldValidate: true });
    updateFormDataDebounced({ price: numValue });
  };

  const handleIsFreeChange = (checked: boolean) => {
    setValue("isFree", checked, { shouldValidate: true });
    updateFormDataImmediate({ isFree: checked });

    // If event is free, set price to 0
    if (checked) {
      setValue("price", 0, { shouldValidate: true });
      updateFormDataImmediate({ price: 0 });
    }
  };

  // Debounced sync for text inputs
  const debouncedSyncTextInputs = React.useMemo(
    () => debounce((data: { eventTitle?: string; eventDescription?: string }) => {
      updateFormDataDebounced(data);
    }, 500),
    [updateFormDataDebounced]
  );

  // Sync text inputs to store
  React.useEffect(() => {
    debouncedSyncTextInputs({
      eventTitle,
      eventDescription,
    });
  }, [eventTitle, eventDescription, debouncedSyncTextInputs]);

  const handleExitClick = () => {
    router.push("/");
  };

  const handlePreviewClick = () => {
    // Preserve the type parameter when navigating to preview
    const currentType = searchParams.get("type");
    if (currentType) {
      router.push(`/allocation-admin/create/preview?type=${currentType}`);
    } else {
      router.push("/allocation-admin/create/preview");
    }
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <form className="space-y-6">
        {/* First Question */}
        <div>
          <h2 className="text-(--color-dark-slate) font-source-sans-pro text-[20px] font-semibold leading-normal mb-2">
            What's the name of your event?
          </h2>
          <p className="text-(--body-text) font-source-sans-pro text-base font-normal leading-[160%] mb-4">
            This will be your event's title. Your title will be used to help
            create your event's summary, description, category, and tags – so be
            specific!
          </p>
          <FormInput
            label="Event title"
            placeholder="Event title*"
            required={true}
            error={errors.eventTitle?.message}
            {...register("eventTitle")}
          />
        </div>

        {/* Second Question */}
        <div>
          <h2 className="text-(--color-dark-slate) font-source-sans-pro text-[20px] font-semibold leading-normal mb-4">
            Tell more about the event?
          </h2>
          <FormTextarea
            label="Event description"
            placeholder="Event description*"
            required={true}
            error={errors.eventDescription?.message}
            {...register("eventDescription")}
          />
        </div>

        {/* Third Question - Image Upload */}
        <div>
          <h2 className="text-(--color-dark-slate) font-source-sans-pro text-[20px] font-semibold leading-normal mb-2">
            Upload a cover image
          </h2>
          <p className="text-(--body-text) font-source-sans-pro text-base font-normal leading-[160%] mb-2">
            This image will be the main visual representation of your event.
            Choose a clear, high-quality photo that best showcases the space to
            attract users' attention.
          </p>
          <p className="text-(--body-text) font-source-sans-pro text-sm font-normal mb-4">
            Recommended dimensions: 1200 x 800 pixels for optimal display
          </p>
          <ImageUpload
            label="Upload event cover image"
            maxFiles={1}
            onImagesChange={handleImageChange}
            error={errors.image?.message}
            required={true}
          />
        </div>

        {/* Divider */}
        <Divider className="mt-8" />

        {/* Fourth Question - Date and Time */}
        <div>
          <h2 className="text-(--color-dark-slate) font-source-sans-pro text-[20px] font-semibold leading-normal mb-4">
            When does your event start and end?
          </h2>
          <DateTimePicker
            date={eventDate}
            startTime={startTime}
            endTime={endTime}
            onDateChange={handleDateChange}
            onStartTimeChange={handleStartTimeChange}
            onEndTimeChange={handleEndTimeChange}
            dateError={errors.eventDate?.message}
            startTimeError={errors.startTime?.message}
            endTimeError={errors.endTime?.message}
            required={true}
          />
        </div>

        {/* Fifth Question - Agenda */}
        <div>
          <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-4">
            Fill out the agenda of your event
          </h2>
          <AgendaManager
            agenda={agenda}
            onChange={handleAgendaChange}
            errors={
              errors.agenda && Array.isArray(errors.agenda)
                ? errors.agenda.reduce(
                    (acc: any, error: any, index: number) => {
                      if (error && agenda[index]) {
                        acc[agenda[index].id] = error;
                      }
                      return acc;
                    },
                    {}
                  )
                : {}
            }
          />
          {errors.agenda &&
            typeof errors.agenda === "object" &&
            "message" in errors.agenda && (
              <p
                className="text-red-500 text-sm font-source-sans-pro mt-2"
                role="alert"
              >
                {(errors.agenda as any).message}
              </p>
            )}
        </div>

        {/* Sixth Question - Category Selection */}
        <div>
          <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-2">
            Which category does this event belong to?
          </h2>
          <p className="text-[#7A7A7A] font-source-sans-pro text-base font-normal leading-[160%] mb-4">
            This will be your event's title. Your title will be used to help
            create your event's summary, description, category, and tags – so be
            specific!
          </p>
          <CategorySelector
            value={categories}
            onChange={handleCategoriesChange}
            error={errors.categories?.message}
            required={true}
          />
        </div>

        {/* Seventh Question - Location */}
        <div>
          <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-4">
            Where is it located?
          </h2>
          <LocationSelector
            value={location}
            eventType={eventType}
            onChange={handleLocationChange}
            onEventTypeChange={handleEventTypeChange}
            error={
              errors.location?.address?.message ||
              errors.location?.city?.message ||
              errors.location?.state?.message ||
              errors.location?.country?.message ||
              (errors.location as any)?.message
            }
            required={eventType === "venue"}
          />
        </div>

        {/* Eighth Question - Event Capacity */}
        <div>
          <h2 className="text-(--color-dark-slate) font-source-sans-pro text-[20px] font-semibold leading-normal mb-2">
            What's the capacity for your event?
          </h2>
          <p className="text-(--body-text) font-source-sans-pro text-base font-normal leading-[160%] mb-4">
            Event capacity is the total number of tickets you're willing to
            sell.
          </p>
          <FormInput
            label="Total capacity"
            placeholder="Total capacity*"
            type="number"
            required={true}
            error={errors.capacity?.message}
            value={capacity.toString()}
            onChange={handleCapacityChange}
          />
        </div>

        {/* Ninth Question - Event Pricing */}
        <div>
          <h2 className="text-(--color-dark-slate) font-source-sans-pro text-[20px] font-semibold leading-normal mb-2">
            How much do you want to charge for tickets?
          </h2>
          <p className="text-(--body-text) font-source-sans-pro text-base font-normal leading-[160%] mb-4">
            Our tool can only generate one General Admission ticket for now. You
            can edit and add more ticket types later.
          </p>

          {/* Price Input - Only show when not free */}
          {!isFree && (
            <div className="mb-4">
              <FormInput
                label="Price"
                placeholder="Price*"
                type="number"
                required={true}
                error={errors.price?.message}
                value={price.toString()}
                onChange={handlePriceChange}
                prefix="₦"
              />
            </div>
          )}

          {/* My event is free toggle */}
          <div className="flex items-center space-x-3">
            <span className="text-(--color-dark-slate) font-source-sans-pro text-base font-normal">
              My event is free
            </span>
            <Switch checked={isFree} onCheckedChange={handleIsFreeChange} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            size="allotease-md"
            onClick={handleExitClick}
            className="text-(--body-text) hover:text-(--color-dark-slate)"
          >
            Exit
          </Button>
          <Button
            type="button"
            variant="signup-primary"
            size="allotease-md"
            onClick={handlePreviewClick}
          >
            Preview Event
          </Button>
        </div>
      </form>
    </div>
  );
}

// Main component that wraps the useSearchParams component in Suspense
export function EventsForm() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <EventsFormContent />
    </Suspense>
  );
}