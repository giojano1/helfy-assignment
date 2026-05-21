import { z } from 'zod';

const shippingAddressSchema = z.object({
  fullName: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  zip: z.string().min(1),
});

export const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  shippingMethod: z.enum(['standard', 'express', 'overnight']),
  paymentMethod: z.enum(['cod', 'card']),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
