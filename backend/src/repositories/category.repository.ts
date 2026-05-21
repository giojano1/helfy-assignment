import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Category } from '../models/Category';

export class CategoryRepository {
  private readonly repo: Repository<Category>;

  constructor() {
    this.repo = AppDataSource.getRepository(Category);
  }

  /** Return all categories ordered by name. */
  async findAll(): Promise<Category[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  /** Find a category by its slug. */
  async findBySlug(slug: string): Promise<Category | null> {
    return this.repo.findOne({ where: { slug } });
  }

  /** Insert a new category and return it. */
  async create(data: { name: string; slug: string }): Promise<Category> {
    const category = this.repo.create(data);
    return this.repo.save(category);
  }
}
