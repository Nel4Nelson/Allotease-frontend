/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { Suspense } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { Divider } from "@/components/ui/divider";
import {
  LocationSelector,
  type LocationData,
} from "@/components/ui/location-selector";
import { FormSelect } from "@/components/ui/form-select";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "lodash";
import { useDebouncedStaysFormStore } from "@/hooks/use-debounced-stay-store";
import { UnitManager } from "@/components/ui/unit-manager";
import { StaysFormData } from "@/types/stays-form-schema";
import { FacilitiesBadgeSelector } from "@/components/ui/facilities-badge-selector";

// Create a partial schema for the current step of the form
// This only includes the fields that are being validated in this component
const partialStaysFormSchema = z.object({
  accommodationTitle: z
    .string()
    .min(1, { message: "Accommodation title is required." })
    .max(100, { message: "Title must not exceed 100 characters." }),
  accommodationDescription: z
    .string()
    .min(1, { message: "Accommodation description is required." })
    .max(1000, { message: "Description must not exceed 1000 characters." }),
  images: z
    .array(z.instanceof(File))
    .min(1, { message: "At least one image is required." })
    .max(10, { message: "Maximum 10 images allowed." }),
  location: z.object({
    address: z.string().min(1, { message: "Address is required." }),
    city: z.string().min(1, { message: "City is required." }),
    state: z.string().min(1, { message: "State is required." }),
    country: z.string().min(1, { message: "Country is required." }),
    coordinates: z.tuple([z.number(), z.number()]).optional(),
  }),
  accommodationType: z
    .string()
    .min(1, { message: "Accommodation type is required." }),
});

// Type for the partial form data
type PartialStaysFormData = z.infer<typeof partialStaysFormSchema>;

const accommodationTypes = [
  // Old types (keep for backward compatibility)
  { value: "hotel & lodging", label: "Hotel & Lodging" },
  { value: "appartments", label: "Apartments" },
  { value: "school-lodges", label: "School Lodges" },

  // New types
  { value: "apartment", label: "Apartment" },
  { value: "shared apartment", label: "Shared Apartment" },
  { value: "house", label: "House" },
  { value: "student hostel", label: "Student Hostel" },
  { value: "hotel room", label: "Hotel Room" },
  { value: "guest house", label: "Guest House" },
  { value: "shortlet / serviced apartment", label: "Shortlet / Serviced Apartment" },
  { value: "co-working space", label: "Co-working Space" },
  { value: "event hall / meeting space", label: "Event Hall / Meeting Space" },
  { value: "shop / retail space", label: "Shop / Retail Space" },
  { value: "others", label: "Others" },
];

interface StaysFormProps {
  isLoading?: boolean;
}

function StaysFormContent({ }: StaysFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Zustand store integration
  const {
    formData: storeData,
    updateFormDataImmediate,
    updateFormDataDebounced,
  } = useDebouncedStaysFormStore();

  // Helper function to ensure coordinates are properly typed
  const getTypedLocation = (location: any): LocationData | undefined => {
    if (!location) return undefined;

    return {
      address: location.address || "",
      city: location.city || "",
      state: location.state || "",
      country: location.country || "",
      // Ensure coordinates are a tuple or undefined
      coordinates:
        location.coordinates &&
          Array.isArray(location.coordinates) &&
          location.coordinates.length === 2
          ? ([location.coordinates[0], location.coordinates[1]] as [
            number,
            number
          ])
          : undefined,
    };
  };

  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<PartialStaysFormData>({
    resolver: zodResolver(partialStaysFormSchema),
    mode: "onChange",
    defaultValues: {
      accommodationTitle: storeData.accommodationTitle || "",
      accommodationDescription: storeData.accommodationDescription || "",
      images: storeData.images || [],
      location: getTypedLocation(storeData.location) || {
        address: "",
        city: "",
        state: "",
        country: "",
      },
      accommodationType: storeData.accommodationType || "",
    },
  });

  const location = watch("location");

  // Watch for text input changes
  const accommodationTitle = watch("accommodationTitle");
  const accommodationDescription = watch("accommodationDescription");

  const handleImagesChange = (images: File[]) => {
    setValue("images", images, { shouldValidate: true });
    // Immediately sync to store for files
    updateFormDataImmediate({ images });
  };

  const handleLocationChange = (selectedLocation: LocationData | null) => {
    if (selectedLocation) {
      setValue("location", selectedLocation, { shouldValidate: true });

      // Update both location and geoLocation in store
      const updateData: Partial<StaysFormData> = {
        location: selectedLocation,
      };

      // If coordinates are available, add geoLocation
      if (selectedLocation.coordinates) {
        updateData.geoLocation = {
          coordinates: selectedLocation.coordinates,
        };
      }

      updateFormDataImmediate(updateData);
    }
  };

  const handleAccommodationTypeChange = (value: string) => {
    setValue("accommodationType", value, { shouldValidate: true });
    updateFormDataImmediate({ accommodationType: value });
  };

  // Debounced sync for text inputs
  const debouncedSyncTextInputs = React.useMemo(
    () =>
      debounce(
        (data: {
          accommodationTitle?: string;
          accommodationDescription?: string;
        }) => {
          updateFormDataDebounced(data);
        },
        500
      ),
    [updateFormDataDebounced]
  );

  // Sync text inputs to store
  React.useEffect(() => {
    debouncedSyncTextInputs({
      accommodationTitle,
      accommodationDescription,
    });
  }, [accommodationTitle, accommodationDescription, debouncedSyncTextInputs]);

  const handleExitClick = () => {
    router.push("/");
  };

  const handlePreviewClick = () => {
    // Preserve the type parameter when navigating to preview
    const currentType = searchParams.get("type");
    if (currentType) {
      router.push(`/allocation-admin/create/preview?type=${currentType}`);
    } else {
      router.push("/allocation-admin/create/preview?type=stays");
    }
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <form className="space-y-6">
        {/* First Question */}
        <div>
          <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-2">
            What's the name of your space?
          </h2>
          <p className="text-[#7A7A7A] font-source-sans-pro text-base font-normal leading-[160%] mb-4">
            If your space already has a name, we want to know — it’ll help shape
            your space’s outlook and tags. If not, no worries, you’ll need to
            give it one. Think something demure, something classy. Guests won't
            go for a title that seems 'shabby', so be clear and specific.
          </p>
          <FormInput
            label="Accommodation title"
            placeholder="Space title*"
            required={true}
            error={errors.accommodationTitle?.message}
            {...register("accommodationTitle")}
          />
        </div>

        {/* Second Question */}
        <div>
          <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-6">
            Tell more about the space?
          </h2>
          <FormTextarea
            label="Accommodation description"
            placeholder="Space description*"
            required={true}
            error={errors.accommodationDescription?.message}
            {...register("accommodationDescription")}
          />
        </div>

        {/* Third Question - Image Upload */}
        <div>
          <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-2">
            Add Images to bring your space to life.
          </h2>
          <p className="text-[#7A7A7A] font-source-sans-pro text-base font-normal leading-[160%] mb-4">
            The eyes <span className="line-through">eat</span> buy first. Choose
            sharp, well-lit photos that show your space at its best.
          </p>
          <p className="text-[#7A7A7A] font-source-sans-pro text-sm font-normal mb-4">
            Recommended dimensions: 1200 x 800 pixels for optimal display.
            Upload up to 10 images.
          </p>
          <ImageUpload
            label="Upload accommodation images"
            maxFiles={10}
            onImagesChange={handleImagesChange}
            error={errors.images?.message}
            required={true}
          />
        </div>

        {/* Divider */}
        <Divider className="mt-8" />

        {/* Location Section */}
        <div>
          <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-4">
            Where’s your space located?
          </h2>
          <LocationSelector
            mode="stays"
            value={location}
            onChange={handleLocationChange}
            error={
              errors.location?.address?.message ||
              errors.location?.city?.message ||
              errors.location?.state?.message ||
              errors.location?.country?.message
            }
            required={true}
          />
        </div>

        {/* Accommodation Type Section */}
        <div>
          <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-4">
            What kind of space are you listing?
          </h2>
          <Controller
            name="accommodationType"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Accommodation Type"
                placeholder="Select the type of space you're listing*"
                options={accommodationTypes}
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  handleAccommodationTypeChange(value);
                }}
                error={errors.accommodationType?.message}
                required={true}
              />
            )}
          />
        </div>

        {/* Facilities Section */}
        <div>
          <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-2">
            What's in Your Space? We'd love to know!
          </h2>
          <p className="text-[#7A7A7A] font-source-sans-pro text-base font-normal leading-[160%] mb-4">
            Because basic is boring. Guests love the little extras. Show off the
            amazing facilities that make your space stand out.
          </p>
          {/* Replace <FacilitiesSelector /> with: */}
          <FacilitiesBadgeSelector />
        </div>

        {/* Units Section */}
        <div>
          <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-4">
            Available space
          </h2>
          <UnitManager />
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
            Preview Stay
          </Button>
        </div>
      </form>
    </div>
  );
}

// Main component that wraps the useSearchParams component in Suspense
export function StaysForm(props: StaysFormProps) {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <StaysFormContent {...props} />
    </Suspense>
  );
}
