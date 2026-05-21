import { Repository, SelectQueryBuilder } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Product } from '../models/Product';
import type { ProductFilters } from '../schemas/product.schema';

export class ProductRepository {
  private readonly repo: Repository<Product>;

  constructor() {
    this.repo = AppDataSource.getRepository(Product);
  }

  /** Find a product by its slug, including images, category, and tags. */
  async findBySlug(slug: string): Promise<Product | null> {
    return this.repo.findOne({
      where: { slug },
      relations: ['images', 'category', 'tags'],
    });
  }

  /** Find a product by UUID. */
  async findById(id: string): Promise<Product | null> {
    return this.repo.findOne({ where: { id }, relations: ['images', 'category', 'tags'] });
  }

  /** Return paginated list applying filters, search, and sorting. */
  async findPaginated(filters: ProductFilters): Promise<[Product[], number]> {
    const qb: SelectQueryBuilder<Product> = this.repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.tags', 'tags')
      .where('product.deleted_at IS NULL');

    if (filters.categoryId) {
      qb.andWhere('product.category_id = :categoryId', { categoryId: filters.categoryId });
    }

    if (filters.minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters.maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    if (filters.inStock) {
      qb.andWhere('product.stock > 0');
    }

    if (filters.tag) {
      qb.andWhere('tags.slug = :tag', { tag: filters.tag });
    }

    if (filters.q) {
      qb.andWhere('(product.name LIKE :q OR product.description LIKE :q)', {
        q: `%${filters.q}%`,
      });
    }

    const sortColumn =
      filters.sort === 'price'
        ? 'product.price'
        : filters.sort === 'rating'
          ? 'product.rating'
          : 'product.createdAt';

    qb.orderBy(sortColumn, filters.order.toUpperCase() as 'ASC' | 'DESC');
    qb.skip((filters.page - 1) * filters.limit).take(filters.limit);

    return qb.getManyAndCount();
  }

  /** Return all featured products. */
  async findFeatured(): Promise<Product[]> {
    return this.repo.find({
      where: { isFeatured: true },
      relations: ['images', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  /** Insert a new product and return it. */
  async create(data: Partial<Product>): Promise<Product> {
    const product = this.repo.create(data);
    return this.repo.save(product);
  }

  /** Persist changes to an existing product. */
  async save(product: Product): Promise<Product> {
    return this.repo.save(product);
  }

  /** Soft-delete a product by UUID. */
  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }
}
