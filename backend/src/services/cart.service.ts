import { AppError } from '../utils/AppError';
import { CartRepository } from '../repositories/cart.repository';
import { ProductRepository } from '../repositories/product.repository';
import type { Cart } from '../models/Cart';
import type { AddToCartDto, UpdateCartItemDto, MergeCartDto } from '../schemas/cart.schema';

const cartRepo = new CartRepository();
const productRepo = new ProductRepository();

/** Resolve or create the cart for an authenticated user. */
async function getOrCreateUserCart(userId: string): Promise<Cart> {
  const existing = await cartRepo.findByUserId(userId);
  if (existing) return existing;
  return cartRepo.create({ userId });
}

/**
 * Return the cart for the authenticated user with all items populated.
 */
export async function getCart(userId: string): Promise<Cart> {
  return getOrCreateUserCart(userId);
}

/**
 * Add a product to the cart. If the item already exists, increment quantity.
 */
export async function addItem(userId: string, dto: AddToCartDto): Promise<Cart> {
  const product = await productRepo.findById(dto.productId);
  if (!product) {
    throw new AppError('Product not found', 404, 'NOT_FOUND');
  }
  if (product.stock < dto.quantity) {
    throw new AppError('Insufficient stock', 422, 'INSUFFICIENT_STOCK');
  }

  const cart = await getOrCreateUserCart(userId);
  const existing = await cartRepo.findItemByProduct(cart.id, dto.productId);

  if (existing) {
    existing.quantity += dto.quantity;
    await cartRepo.saveItem(existing);
  } else {
    await cartRepo.createItem({
      cartId: cart.id,
      productId: dto.productId,
      quantity: dto.quantity,
      price: product.price,
    });
  }

  return getOrCreateUserCart(userId);
}

/**
 * Update the quantity of a specific cart item.
 */
export async function updateItem(
  userId: string,
  itemId: string,
  dto: UpdateCartItemDto,
): Promise<Cart> {
  const item = await cartRepo.findItemById(itemId);
  if (!item || item.cart.userId !== userId) {
    throw new AppError('Cart item not found', 404, 'NOT_FOUND');
  }

  item.quantity = dto.quantity;
  await cartRepo.saveItem(item);

  return getOrCreateUserCart(userId);
}

/**
 * Remove a specific item from the cart.
 */
export async function removeItem(userId: string, itemId: string): Promise<Cart> {
  const item = await cartRepo.findItemById(itemId);
  if (!item || item.cart.userId !== userId) {
    throw new AppError('Cart item not found', 404, 'NOT_FOUND');
  }

  await cartRepo.deleteItem(itemId);
  return getOrCreateUserCart(userId);
}

/**
 * Remove all items from the authenticated user's cart.
 */
export async function clearCart(userId: string): Promise<void> {
  const cart = await cartRepo.findByUserId(userId);
  if (cart) {
    await cartRepo.clearItems(cart.id);
  }
}

/**
 * Merge guest localStorage cart items into the authenticated user's cart.
 */
export async function mergeGuestCart(userId: string, dto: MergeCartDto): Promise<Cart> {
  const cart = await getOrCreateUserCart(userId);

  for (const guestItem of dto.items) {
    const product = await productRepo.findById(guestItem.productId);
    if (!product) continue;

    const existing = await cartRepo.findItemByProduct(cart.id, guestItem.productId);
    if (existing) {
      existing.quantity += guestItem.quantity;
      await cartRepo.saveItem(existing);
    } else {
      await cartRepo.createItem({
        cartId: cart.id,
        productId: guestItem.productId,
        quantity: guestItem.quantity,
        price: product.price,
      });
    }
  }

  return getOrCreateUserCart(userId);
}
