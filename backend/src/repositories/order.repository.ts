import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Order } from '../models/Order';

export class OrderRepository {
  private readonly repo: Repository<Order>;

  constructor() {
    this.repo = AppDataSource.getRepository(Order);
  }

  /** Find an order by UUID — only if it belongs to the given user. */
  async findByIdAndUser(id: string, userId: string): Promise<Order | null> {
    return this.repo.findOne({
      where: { id, userId },
      relations: ['items', 'items.product', 'items.product.images'],
    });
  }

  /** Return paginated order history for a user. */
  async findByUser(userId: string, page: number, limit: number): Promise<[Order[], number]> {
    return this.repo.findAndCount({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  /** Insert a new order and return it. */
  async create(data: Partial<Order>): Promise<Order> {
    const order = this.repo.create(data);
    return this.repo.save(order);
  }

  /** Persist order changes. */
  async save(order: Order): Promise<Order> {
    return this.repo.save(order);
  }
}
