import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive(),
});

export const mergeCartSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
    }),
  ),
});

export type AddToCartDto = z.infer<typeof addToCartSchema>;
export type UpdateCartItemDto = z.infer<typeof updateCartItemSchema>;
export type MergeCartDto = z.infer<typeof mergeCartSchema>;
