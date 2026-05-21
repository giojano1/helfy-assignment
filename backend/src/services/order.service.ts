import { AppDataSource } from '../config/database';
import { AppError } from '../utils/AppError';
import { buildPaginationMeta } from '../utils/paginate';
import { OrderRepository } from '../repositories/order.repository';
import { CartRepository } from '../repositories/cart.repository';
import { ProductRepository } from '../repositories/product.repository';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { CartItem } from '../models/CartItem';
import type { CreateOrderDto } from '../schemas/order.schema';
import type { PaginationMeta } from '../utils/paginate';

const orderRepo = new OrderRepository();
const cartRepo = new CartRepository();
const productRepo = new ProductRepository();

const SHIPPING_COSTS: Record<string, number> = {
  standard: 0,
  express: 9.99,
  overnight: 24.99,
};
const TAX_RATE = 0.08;

/**
 * Create an order from the user's current cart.
 * Decrements stock and clears the cart inside a single transaction.
 */
export async function createOrder(userId: string, dto: CreateOrderDto): Promise<Order> {
  const cart = await cartRepo.findByUserId(userId);
  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 422, 'CART_EMPTY');
  }

  const shippingCost = SHIPPING_COSTS[dto.shippingMethod] ?? 0;
  const subtotal = cart.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const total = parseFloat((subtotal + shippingCost + tax).toFixed(2));

  return AppDataSource.transaction(async (manager) => {
    for (const item of cart.items) {
      const product = await productRepo.findById(item.productId);
      if (!product) throw new AppError(`Product ${item.productId} not found`, 404, 'NOT_FOUND');
      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${product.name}`, 422, 'INSUFFICIENT_STOCK');
      }
      product.stock -= item.quantity;
      await manager.save(product);
    }

    const order = manager.create(Order, {
      userId,
      status: 'pending' as const,
      subtotal: parseFloat(subtotal.toFixed(2)),
      shippingCost,
      tax,
      total,
      shippingAddress: dto.shippingAddress as unknown as Record<string, unknown>,
      paymentMethod: dto.paymentMethod,
    });
    const savedOrder = await manager.save(order);

    for (const item of cart.items) {
      const orderItem = manager.create(OrderItem, {
        orderId: savedOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: Number(item.price),
        total: parseFloat((Number(item.price) * item.quantity).toFixed(2)),
      });
      await manager.save(orderItem);
    }

    await manager.delete(CartItem, { cartId: cart.id });

    return manager.findOneOrFail(Order, {
      where: { id: savedOrder.id },
      relations: ['items', 'items.product'],
    });
  });
}

/**
 * Return paginated order history for the authenticated user.
 */
export async function listOrders(
  userId: string,
  page: number,
  limit: number,
): Promise<{ orders: Order[]; meta: PaginationMeta }> {
  const [orders, total] = await orderRepo.findByUser(userId, page, limit);
  return { orders, meta: buildPaginationMeta(page, limit, total) };
}

/**
 * Return a single order — only accessible by its owner.
 */
export async function getOrderById(userId: string, orderId: string): Promise<Order> {
  const order = await orderRepo.findByIdAndUser(orderId, userId);
  if (!order) {
    throw new AppError('Order not found', 404, 'NOT_FOUND');
  }
  return order;
}
