/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormInput } from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";

const forgotPasswordFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." })
    .max(100, { message: "Email must not exceed 100 characters." }),
});

export interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordFormProps {
  onSubmit: (values: ForgotPasswordFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

export function ForgotPasswordForm({
  onSubmit,
  isLoading = false,
  submitButtonText = "Send Reset OTP",
}: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center space-y-3 mb-6">
        <p className="text-[var(--body-text)] font-source-sans-pro max-w-md mx-auto">
          Enter your email address and we'll send you a code to reset your password.
        </p>
      </div>

      <div className="space-y-3">
        <FormInput
          label="Email"
          placeholder="Email*"
          type="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />
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