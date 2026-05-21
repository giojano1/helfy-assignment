import { AppError } from '../utils/AppError';
import { buildPaginationMeta } from '../utils/paginate';
import { ProductRepository } from '../repositories/product.repository';
import type { ProductFilters } from '../schemas/product.schema';
import type { PaginationMeta } from '../utils/paginate';
import type { Product } from '../models/Product';

const productRepo = new ProductRepository();

/**
 * Return a paginated, filtered product list.
 */
export async function listProducts(
  filters: ProductFilters,
): Promise<{ products: Product[]; meta: PaginationMeta }> {
  const [products, total] = await productRepo.findPaginated(filters);
  return { products, meta: buildPaginationMeta(filters.page, filters.limit, total) };
}

/**
 * Return a single product by its slug.
 */
export async function getProductBySlug(slug: string): Promise<Product> {
  const product = await productRepo.findBySlug(slug);
  if (!product) {
    throw new AppError('Product not found', 404, 'NOT_FOUND');
  }
  return product;
}

/**
 * Return all featured products.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  return productRepo.findFeatured();
}
