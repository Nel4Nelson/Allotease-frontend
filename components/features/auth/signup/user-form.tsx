"use client";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormInput } from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import { UserFormData } from "@/types/auth";

const userFormSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First name is required." })
      .min(2, { message: "First name must be at least 2 characters." })
      .max(50, { message: "First name must not exceed 50 characters." })
      .regex(/^[a-zA-Z\s'-]+$/, {
        message: "First name contains invalid characters.",
      }),

    lastName: z
      .string()
      .min(1, { message: "Last name is required." })
      .min(2, { message: "Last name must be at least 2 characters." })
      .max(50, { message: "Last name must not exceed 50 characters." })
      .regex(/^[a-zA-Z\s'-]+$/, {
        message: "Last name contains invalid characters.",
      }),

    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Please enter a valid email address." })
      .max(100, { message: "Email must not exceed 100 characters." }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .max(100, { message: "Password must not exceed 100 characters." })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        {
          message:
            "Password must contain uppercase, lowercase, number, and special character.",
        }
      ),

    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

interface UserFormProps {
  onSubmit: (values: UserFormData) => void;
  defaultValues?: UserFormData | null;
  isLoading?: boolean;
  submitButtonText?: string;
}

export function UserForm({
  onSubmit,
  defaultValues,
  isLoading = false,
  submitButtonText = "Sign Up",
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid},
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const formFields = [
    {
      name: "firstName" as const,
      label: "First Name",
      placeholder: "First Name*",
      type: "text",
      required: true,
    },
    {
      name: "lastName" as const,
      label: "Last Name",
      placeholder: "Last Name*",
      type: "text",
      required: true,
    },
    {
      name: "email" as const,
      label: "Email",
      placeholder: "Email*",
      type: "email",
      required: true,
    },
    {
      name: "password" as const,
      label: "Password",
      placeholder: "Password*",
      type: "password",
      required: true,
    },
    {
      name: "confirmPassword" as const,
      label: "Confirm Password",
      placeholder: "Confirm Password*",
      type: "password",
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
