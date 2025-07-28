"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormInput } from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import { OrganizationFormData } from "@/types/auth";

const organizationFormSchema = z.object({
  organizationName: z
    .string()
    .min(1, { message: "Organization name is required." })
    .min(2, { message: "Organization name must be at least 2 characters." })
    .max(100, { message: "Organization name must not exceed 100 characters." }),

  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required." })
    .regex(/^(\+234|0)[789]\d{9}$/, {
      message: "Please enter a valid Nigerian phone number.",
    }),

  accountInfo: z
    .string()
    .min(1, { message: "Account information is required." })
    .min(2, { message: "Account information must be at least 2 characters." })
    .max(100, {
      message: "Account information must not exceed 100 characters.",
    }),
});

interface OrganizationFormProps {
  onSubmit: (values: OrganizationFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

export function OrganizationForm({
  onSubmit,
  isLoading = false,
  submitButtonText = "Sign Up",
}: OrganizationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationFormSchema),
    mode: "onChange",
    defaultValues: {
      organizationName: "",
      phoneNumber: "",
      accountInfo: "",
    },
  });

  const formFields = [
    {
      name: "organizationName" as const,
      label: "Organization Name",
      placeholder: "Organization Name*",
      type: "text",
      required: true,
    },
    {
      name: "phoneNumber" as const,
      label: "Phone Number",
      placeholder: "Phone Number*",
      type: "tel",
      required: true,
    },
    {
      name: "accountInfo" as const,
      label: "Account Information",
      placeholder: "Account Information*",
      type: "text",
      required: true,
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-3">
        {formFields.map(({ name, label, placeholder, type, required }) => (
          <FormInput
            key={name}
            label={label}
            placeholder={placeholder}
            type={type}
            required={required}
            error={errors[name]?.message}
            {...register(name)}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <Button
          type="submit"
          variant="signup-primary"
          size="allotease-lg"
          className="w-2/3"
          loading={isLoading}
          disabled={isLoading || !isValid || !isDirty}
        >
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
}
