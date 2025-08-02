import { z } from "zod";

export const bankDetailsSchema = z.object({
  accountHolderName: z
    .string()
    .min(1, "Account holder name is required")
    .min(2, "Account holder name must be at least 2 characters")
    .max(100, "Account holder name must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s.'-]+$/,
      "Account holder name contains invalid characters"
    ),

  bankName: z
    .string()
    .min(1, "Bank name is required")
    .min(2, "Bank name must be at least 2 characters")
    .max(100, "Bank name must be less than 100 characters"),

  accountNumber: z
    .string()
    .min(1, "Account number is required")
    .min(8, "Account number must be at least 8 characters")
    .max(34, "Account number must be less than 34 characters")
    .regex(
      /^[A-Z0-9]+$/,
      "Account number must contain only letters and numbers"
    ),

  branchCode: z
    .string()
    .min(1, "Branch code is required")
    .min(3, "Branch code must be at least 3 characters")
    .max(11, "Branch code must be less than 11 characters")
    .regex(/^[A-Z0-9]+$/, "Branch code must contain only letters and numbers"),

  swiftCode: z
    .string()
    .min(1, "SWIFT code is required")
    .regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, "Invalid SWIFT code format")
    .refine((code) => code.length === 8 || code.length === 11, {
      message: "SWIFT code must be 8 or 11 characters long",
    }),
});

export type BankDetailsFormData = z.infer<typeof bankDetailsSchema>;
