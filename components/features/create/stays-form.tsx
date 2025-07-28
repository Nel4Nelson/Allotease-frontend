/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { Divider } from "@/components/ui/divider";
import {
  LocationSelector,
  type LocationData,
} from "@/components/ui/location-selector";
import { FormSelect } from "@/components/ui/form-select";
import { FacilitiesSelector } from "@/components/ui/facilities-selector";
import { UnitsManager } from "@/components/ui/units-manager";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedStaysFormStore } from "@/hooks/use-debounced-stay-store";
import { debounce } from "lodash";
import { StaysFormData, staysFormSchema } from "@/types/stays-form-schema";

const accommodationTypes = [
  { value: "hotel-lodging", label: "Hotel & Lodging" },
  { value: "apartments", label: "Apartments" },
  { value: "school-lodges", label: "School Lodges" },
];


export function StaysForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Zustand store integration
  const { 
    formData: storeData, 
    updateFormDataImmediate, 
    updateFormDataDebounced,
    selectedFacilities,
    addFacilityToSelection,
    removeFacilityFromSelection,
    updateFacilitiesCache,
    getFacilityDetails,
    
    // Units management
    units,
    addUnitToStore,
    updateUnitInStore,
    removeUnitFromStore,
    addFacilityToUnit,
    removeFacilityFromUnit,
    getUnitFacilities,
  } = useDebouncedStaysFormStore();
  
  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<StaysFormData>({
    resolver: zodResolver(staysFormSchema),
    mode: "onChange",
    defaultValues: {
      accommodationTitle: storeData.accommodationTitle || "",
      accommodationDescription: storeData.accommodationDescription || "",
      images: storeData.images || [],
      location: storeData.location || undefined,
      accommodationType: storeData.accommodationType || "",
      facilities: storeData.facilities || [],
      units: storeData.units || [],
    },
  });

  const location = watch("location");
  const facilities = watch("facilities");
  const accommodationUnits = watch("units");
  
  // Watch for text input changes
  const accommodationTitle = watch("accommodationTitle");
  const accommodationDescription = watch("accommodationDescription");

  const handleImagesChange = (images: File[]) => {
    setValue("images", images, { shouldValidate: true });
    // Immediately sync to store for files
    updateFormDataImmediate({ images });
  };

  const handleLocationChange = (selectedLocation: LocationData | null) => {
    setValue("location", selectedLocation!, { shouldValidate: true });
    updateFormDataImmediate({ location: selectedLocation || undefined });
  };

  const handleAccommodationTypeChange = (value: string) => {
    setValue("accommodationType", value, { shouldValidate: true });
    updateFormDataImmediate({ accommodationType: value });
  };

  // Facility management handlers
  const handleAddFacility = (facilityId: string) => {
    const currentFacilities = facilities || [];
    const newFacilities = [...currentFacilities, facilityId];
    setValue("facilities", newFacilities, { shouldValidate: true });
    addFacilityToSelection(facilityId);
  };

  const handleRemoveFacility = (facilityId: string) => {
    const currentFacilities = facilities || [];
    const newFacilities = currentFacilities.filter(id => id !== facilityId);
    setValue("facilities", newFacilities, { shouldValidate: true });
    removeFacilityFromSelection(facilityId);
  };

  // Sync facilities to store when they change
  React.useEffect(() => {
    if (facilities) {
      updateFormDataImmediate({ facilities });
    }
  }, [facilities, updateFormDataImmediate]);

  // Sync units to store when they change
  React.useEffect(() => {
    if (accommodationUnits) {
      updateFormDataImmediate({ units: accommodationUnits });
    }
  }, [accommodationUnits, updateFormDataImmediate]);

  // Debounced sync for text inputs
  const debouncedSyncTextInputs = React.useMemo(
    () => debounce((data: { accommodationTitle?: string; accommodationDescription?: string }) => {
      updateFormDataDebounced(data);
    }, 500),
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
        {/* 1. Accommodation Title */}
        <div>
          <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-2">
            What's the name of your accommodation?
          </h2>
          <p className="text-[#7A7A7A] font-source-sans-pro text-base font-normal leading-[160%] mb-4">
            This will be your accommodation's title. Your title will be used to help
            create your accommodation's summary, description, and tags – so be
            specific!
          </p>
          <FormInput
            label="Accommodation title"
            placeholder="Accommodation title*"
            required={true}
            error={errors.accommodationTitle?.message}
            {...register("accommodationTitle")}
          />
        </div>

        {/* 2. Accommodation Description */}
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

        {/* 3. Image Upload */}
        <div>
          <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-2">
            Upload accommodation images
          </h2>
          <p className="text-[#7A7A7A] font-source-sans-pro text-base font-normal leading-[160%] mb-4">
            These images will be the main visual representation of your accommodation.
            Choose clear, high-quality photos that best showcase the space to
            attract users' attention.
          </p>
          <p className="text-[#7A7A7A] font-source-sans-pro text-sm font-normal mb-4">
            Recommended dimensions: 1200 x 800 pixels for optimal display. Upload up to 10 images.
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

        {/* 4. Location */}
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

        {/* 5. Accommodation Type */}
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

        {/* 6. General Facilities */}
        <div>
          <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-2">
            Fill out general facilities available in your accommodation
          </h2>
          <p className="text-[#7A7A7A] font-source-sans-pro text-base font-normal leading-[160%] mb-4">
            Select the facilities and amenities that your accommodation offers.
            This helps guests understand what to expect during their stay.
          </p>
          <FacilitiesSelector
            selectedFacilities={selectedFacilities}
            onAddFacility={handleAddFacility}
            onRemoveFacility={handleRemoveFacility}
            onUpdateCache={updateFacilitiesCache}
            getFacilityDetails={getFacilityDetails}
            error={errors.facilities?.message}
            required={true}
          />
        </div>

        {/* 7. Available Space (Units) */}
        <div>
          <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-2">
            Available space
          </h2>
          <p className="text-[#7A7A7A] font-source-sans-pro text-base font-normal leading-[160%] mb-4">
            Add the different types of accommodation units available in your property.
            Each unit can have its own pricing, facilities, and availability.
          </p>
          <UnitsManager
            units={units}
            onAddUnit={addUnitToStore}
            onUpdateUnit={updateUnitInStore}
            onRemoveUnit={removeUnitFromStore}
            onAddUnitFacility={addFacilityToUnit}
            onRemoveUnitFacility={removeFacilityFromUnit}
            onUpdateCache={updateFacilitiesCache}
            getFacilityDetails={getFacilityDetails}
            getUnitFacilities={getUnitFacilities}
            errors={
              errors.units && Array.isArray(errors.units)
                ? errors.units.reduce(
                    (acc: any, error: any, index: number) => {
                      if (error && accommodationUnits[index]) {
                        acc[accommodationUnits[index].id] = error;
                      }
                      return acc;
                    },
                    {}
                  )
                : {}
            }
          />
          {errors.units &&
            typeof errors.units === "object" &&
            "message" in errors.units && (
              <p
                className="text-red-500 text-sm font-source-sans-pro mt-2"
                role="alert"
              >
                {(errors.units as any).message}
              </p>
            )}
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