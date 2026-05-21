import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Cart } from '../models/Cart';
import { CartItem } from '../models/CartItem';

export class CartRepository {
  private readonly cartRepo: Repository<Cart>;
  private readonly itemRepo: Repository<CartItem>;

  constructor() {
    this.cartRepo = AppDataSource.getRepository(Cart);
    this.itemRepo = AppDataSource.getRepository(CartItem);
  }

  /** Find a user's cart with items and product details. */
  async findByUserId(userId: string): Promise<Cart | null> {
    return this.cartRepo.findOne({
      where: { userId },
      relations: ['items', 'items.product', 'items.product.images'],
    });
  }

  /** Find a guest cart by session ID. */
  async findBySessionId(sessionId: string): Promise<Cart | null> {
    return this.cartRepo.findOne({
      where: { sessionId },
      relations: ['items', 'items.product', 'items.product.images'],
    });
  }

  /** Create a new empty cart. */
  async create(data: { userId?: string; sessionId?: string }): Promise<Cart> {
    const cart = this.cartRepo.create({
      userId: data.userId ?? null,
      sessionId: data.sessionId ?? null,
    });
    return this.cartRepo.save(cart);
  }

  /** Find a cart item by ID. */
  async findItemById(id: string): Promise<CartItem | null> {
    return this.itemRepo.findOne({ where: { id }, relations: ['cart'] });
  }

  /** Find an item in a cart by product ID. */
  async findItemByProduct(cartId: string, productId: string): Promise<CartItem | null> {
    return this.itemRepo.findOne({ where: { cartId, productId } });
  }

  /** Add or update a cart item. */
  async saveItem(item: CartItem): Promise<CartItem> {
    return this.itemRepo.save(item);
  }

  /** Create a new cart item. */
  async createItem(data: {
    cartId: string;
    productId: string;
    quantity: number;
    price: number;
  }): Promise<CartItem> {
    const item = this.itemRepo.create(data);
    return this.itemRepo.save(item);
  }

  /** Delete a cart item by ID. */
  async deleteItem(id: string): Promise<void> {
    await this.itemRepo.delete(id);
  }

  /** Delete all items in a cart. */
  async clearItems(cartId: string): Promise<void> {
    await this.itemRepo.delete({ cartId });
  }

  /** Persist cart changes. */
  async save(cart: Cart): Promise<Cart> {
    return this.cartRepo.save(cart);
  }
}
