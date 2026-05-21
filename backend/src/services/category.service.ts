import { CategoryRepository } from '../repositories/category.repository';
import type { Category } from '../models/Category';

const categoryRepo = new CategoryRepository();

/**
 * Return all categories sorted by name.
 */
export async function listCategories(): Promise<Category[]> {
  return categoryRepo.findAll();
}
