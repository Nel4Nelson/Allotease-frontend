"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormInput } from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";

const resetPasswordFormSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "OTP must be 6 digits." })
    .max(6, { message: "OTP must be 6 digits." })
    .regex(/^\d+$/, { message: "OTP must contain only numbers." }),
  
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(100, { message: "Password must not exceed 100 characters." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/, {
      message:
        "Password must contain uppercase, lowercase, number, and special character.",
    }),

  confirmPassword: z
    .string()
    .min(1, { message: "Please confirm your password." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});

export interface ResetPasswordFormData {
  otp: string;
  password: string;
  confirmPassword: string;
}

interface ResetPasswordFormProps {
  onSubmit: (values: ResetPasswordFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

export function ResetPasswordForm({
  onSubmit,
  isLoading = false,
  submitButtonText = "Reset Password",
}: ResetPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
    mode: "onChange",
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const formFields = [
    {
      name: "otp" as const,
      label: "Verification Code",
      placeholder: "Enter 6-digit code*",
      type: "text",
      required: true,
    },
    {
      name: "password" as const,
      label: "New Password",
      placeholder: "New Password*",
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center space-y-3 mb-6">
        <p className="text-[var(--body-text)] font-source-sans-pro max-w-md mx-auto">
          Enter the 6-digit code sent to your email and create a new password.
        </p>
      </div>

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