import { z } from "zod";
import type { LocationData } from "@/components/ui/location-selector";
import type { UnitData } from "@/stores/stay-form-store";

// Unit validation schema
const unitSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: "Unit title is required." }),
  description: z.string().min(1, { message: "Unit description is required." }),
  price: z.number().min(1, { message: "Unit price must be greater than 0." }),
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"], {
    message: "Pricing frequency is required.",
  }),
  quantity: z.number().min(1, { message: "Unit quantity must be at least 1." }),
  facilities: z.array(z.string()).default([]),
});

// Main stays form schema
export const staysFormSchema = z.object({
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
  }),
  accommodationType: z
    .string()
    .min(1, { message: "Accommodation type is required." }),
  facilities: z
    .array(z.string())
    .min(1, { message: "At least one facility is required." }),
  units: z
    .array(unitSchema)
    .min(1, { message: "At least one accommodation unit is required." }),
});

// Form data interface
export interface StaysFormData {
  accommodationTitle: string;
  accommodationDescription: string;
  images: File[];
  location: LocationData;
  accommodationType: string;
  facilities: string[];
  units: UnitData[];
}

// Type inference from schema
export type StaysFormSchema = z.infer<typeof staysFormSchema>;