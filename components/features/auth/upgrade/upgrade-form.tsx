"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { FormSelect } from "@/components/ui/form-select";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";

const upgradeFormSchema = z.object({
  organizationName: z
    .string()
    .min(1, { message: "Organization name is required." })
    .max(100, { message: "Organization name must not exceed 100 characters." }),

  businessCategory: z
    .string()
    .min(1, { message: "Business category is required." }),

  businessBio: z
    .string()
    .max(500, { message: "Business bio must not exceed 500 characters." })
    .optional(),

  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required." })
    .regex(/^\+?[\d\s-()]+$/, {
      message: "Please enter a valid phone number.",
    }),

  dateOfBirth: z.date({ required_error: "Date of birth is required." }).refine(
    (date) => {
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 18;
    },
    { message: "You must be at least 18 years old." }
  ),

  resourceType: z
    .string()
    .min(1, { message: "Please select what resource you want to create." }),
});

export interface UpgradeFormData {
  organizationName: string;
  businessCategory: string;
  businessBio?: string;
  phoneNumber: string;
  dateOfBirth: Date;
  resourceType: string;
}

interface UpgradeFormProps {
  onSubmit: (values: UpgradeFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

const businessCategories = [
  { value: "housing", label: "Housing" },
  { value: "hospitality", label: "Hospitality" },
  { value: "events", label: "Events" },
  { value: "entertainment", label: "Entertainment" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
];

const resourceTypes = [
  { value: "all", label: "All" },
  { value: "hotel-lodging", label: "Hotel & Lodging" },
  { value: "events", label: "Events" },
];

export function UpgradeForm({
  onSubmit,
  isLoading = false,
  submitButtonText = "Upgrade account",
}: UpgradeFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<UpgradeFormData>({
    resolver: zodResolver(upgradeFormSchema),
    mode: "onChange",
    defaultValues: {
      organizationName: "",
      businessCategory: "",
      businessBio: "",
      phoneNumber: "",
      resourceType: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-3">
        {/* Tell us about your business */}

        {/* Organization Name */}
        <FormInput
          label="Organization Name"
          placeholder="Organization Name*"
          required={true}
          error={errors.organizationName?.message}
          {...register("organizationName")}
        />

        {/* Business Category */}
        <Controller
          name="businessCategory"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Business Category"
              placeholder="Business category*"
              options={businessCategories}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.businessCategory?.message}
              required={true}
            />
          )}
        />

        {/* Business Bio */}
        <FormTextarea
          label="Business Bio"
          placeholder="Business bio"
          error={errors.businessBio?.message}
          {...register("businessBio")}
        />

        {/* Personal Information */}
        <div className="text-left mt-6 mb-4">
          <p className="text-gray-800 font-source-sans-pro font-semibold text-sm">
            Personal information
          </p>
        </div>

        {/* Phone Number */}
        <FormInput
          label="Phone Number"
          placeholder="Phone Number*"
          type="tel"
          required={true}
          error={errors.phoneNumber?.message}
          {...register("phoneNumber")}
        />

        {/* Date of Birth */}
        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Date of Birth"
              placeholder="DOB*"
              value={field.value}
              onChange={field.onChange}
              error={errors.dateOfBirth?.message}
              required={true}
            />
          )}
        />

        {/* Resource Type */}
        <div className="text-left mt-6 mb-4">
          <p className="text-gray-800 font-source-sans-pro font-semibold text-sm">
            What resource do you want to create?
          </p>
        </div>

        <Controller
          name="resourceType"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Resource Type"
              placeholder="Hotel & Lodging"
              options={resourceTypes}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.resourceType?.message}
              required={true}
            />
          )}
        />
      </div>

      <div className="flex justify-center pt-4">
        <Button
          type="submit"
          variant="signup-primary"
          size="allotease-md"
          className="w-2/3"
          loading={isLoading}
          disabled={isLoading || !isValid}
        >
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
}
