/**
 * Catalog feature — local TypeScript types.
 * Mirrors backend/src/types/ shapes — kept in sync by convention.
 * Full type definitions added in Phase 4.
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  categoryId: string;
  category: Category;
  images: ProductImage[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
}

export interface ProductFilters {
  q?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: "price" | "rating" | "createdAt";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}
