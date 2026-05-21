import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  zip: z.string().min(3, "ZIP code is required"),
});

export type AddressSchema = z.infer<typeof addressSchema>;
