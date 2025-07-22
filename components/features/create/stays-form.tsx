/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { Divider } from "@/components/ui/divider";


const staysFormSchema = z.object({
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
});

export interface StaysFormData {
  accommodationTitle: string;
  accommodationDescription: string;
  images: File[];
}

interface StaysFormProps {
  onSubmit: (values: StaysFormData) => void;
  isLoading?: boolean;
}

export function StaysForm({
  onSubmit,
  // isLoading = false,
}: StaysFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StaysFormData>({
    resolver: zodResolver(staysFormSchema),
    mode: "onChange",
    defaultValues: {
      accommodationTitle: "",
      accommodationDescription: "",
      images: [],
    },
  });

  const handleImagesChange = (images: File[]) => {
    setValue('images', images, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* First Question */}
        <div>
          <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-2">
            What's the name of your accommodation?
          </h2>
          <p className="text-[#7A7A7A] font-source-sans-pro text-base font-normal leading-[160%] mb-4">
            This will be your event's title. Your title will be used to help
            create your event's summary, description, category, and tags – so be
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
            Upload a cover image
          </h2>
          <p className="text-[#7A7A7A] font-source-sans-pro text-base font-normal leading-[160%] mb-4">
            This image will be the main visual representation of your event. Choose a clear, high-quality photo that best showcases the space to attract users' attention.
          </p>
          <p className="text-[#7A7A7A] font-source-sans-pro text-sm font-normal mb-4">
            Recommended dimensions: 1200 x 800 pixels for optimal display
          </p>
          <ImageUpload
            label="Upload accommodation images"
            maxFiles={10}
            onImagesChange={handleImagesChange}
            error={errors.images?.message}
            required={true}
          />
        </div>
      </form>

      {/* Divider */}
      <Divider className="mt-8" />
    </div>
  );
}