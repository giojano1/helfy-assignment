import { z } from 'zod';

export const productFiltersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.enum(['price', 'rating', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  categoryId: z.string().uuid().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  tag: z.string().optional(),
  inStock: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
  q: z.string().optional(),
});

export type ProductFilters = z.infer<typeof productFiltersSchema>;
