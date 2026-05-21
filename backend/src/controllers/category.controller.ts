import { Request, Response, NextFunction } from 'express';
import * as categoryService from '../services/category.service';

/**
 * GET /api/v1/categories
 */
export async function listCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await categoryService.listCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
}
