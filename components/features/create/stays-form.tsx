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
import { FacilitiesSelector } from "@/components/ui/facilities-selector";
import { UnitManager } from "@/components/ui/unit-manager";
import { StaysFormData } from "@/types/stays-form-schema";

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
    // Fix: Use tuple type for coordinates
    coordinates: z.tuple([z.number(), z.number()]).optional(),
  }),
  accommodationType: z
    .string()
    .min(1, { message: "Accommodation type is required." }),
});

// Type for the partial form data
type PartialStaysFormData = z.infer<typeof partialStaysFormSchema>;

const accommodationTypes = [
  { value: "hotel & lodging", label: "Hotel & Lodging" },
  { value: "appartments", label: "Apartments" },
  { value: "school-lodges", label: "School Lodges" },
];

interface StaysFormProps {
  isLoading?: boolean;
}

// Component that uses useSearchParams
function StaysFormContent({}: StaysFormProps) {
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
      router.push("/allocation-admin/create/preview");
    }
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <form className="space-y-6">
        {/* First Question */}
        <div>
          <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-2">
            What's the name of your accommodation?
          </h2>
          <p className="text-[#7A7A7A] font-source-sans-pro text-base font-normal leading-[160%] mb-4">
            This will be your accommodation's title. Your title will be used to
            help create your accommodation's summary, description, and tags – so
            be specific!
          </p>
          <FormInput
            label="Accommodation title"
            placeholder="Accommodation title*"
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
            placeholder="Accommodation description*"
            required={true}
            error={errors.accommodationDescription?.message}
            {...register("accommodationDescription")}
          />
        </div>

        {/* Third Question - Image Upload */}
        <div>
          <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-2">
            Upload accommodation images
          </h2>
          <p className="text-[#7A7A7A] font-source-sans-pro text-base font-normal leading-[160%] mb-4">
            These images will be the main visual representation of your
            accommodation. Choose clear, high-quality photos that best showcase
            the space to attract users' attention.
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
            Where is it located?
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
            Select accommodation type
          </h2>
          <Controller
            name="accommodationType"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Accommodation Type"
                placeholder="Select accommodation type*"
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
          <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-4">
            Fill out general facilities available in your accommodation
          </h2>
          <FacilitiesSelector />
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
