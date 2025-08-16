"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormInput } from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";

const signInFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." })
    .max(100, { message: "Email must not exceed 100 characters." }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(100, { message: "Password must not exceed 100 characters." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message:
        "Password must contain uppercase, lowercase, number, and special character.",
    }),
});

export interface SignInFormData {
  email: string;
  password: string;
}

interface SignInFormProps {
  onSubmit: (values: SignInFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

export function SignInForm({
  onSubmit,
  isLoading = false,
  submitButtonText = "Sign In",
}: SignInFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const formFields = [
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
