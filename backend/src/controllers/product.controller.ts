import { Request, Response, NextFunction } from 'express';
import { productFiltersSchema } from '../schemas/product.schema';
import * as productService from '../services/product.service';

/**
 * GET /api/v1/products/featured
 */
export async function getFeatured(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const products = await productService.getFeaturedProducts();
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/products
 */
export async function listProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const filters = productFiltersSchema.parse(req.query);
    const { products, meta } = await productService.listProducts(filters);
    res.json({ success: true, data: products, meta });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/products/:slug
 */
export async function getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await productService.getProductBySlug(req.params['slug'] as string);
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}
